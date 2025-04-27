import { NextRequest, NextResponse } from 'next/server';
import { stripe, PREMIUM_POINTS_PER_MONTH } from '@/lib/stripe';
import { updateUserPoints, updateUserSubscription } from '@/utils/pointsService';
import Stripe from 'stripe';
import { UserPoints } from '@/utils/pointsModel';

// Stripeからのwebhookをハンドリング
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Webhook secret is not configured' },
      { status: 500 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    console.log(`Webhook signature verification failed: ${(err as Error).message}`);
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  // イベントタイプに応じた処理
  try {
    console.log(`Received event: ${event.type}`);
    switch (event.type) {
      // サブスクリプション作成時
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      // サブスクリプション更新時（毎月の課金）
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        if (invoice.billing_reason === 'subscription_cycle') {
          await handleSubscriptionRenewed(invoice);
        }
        break;

      // サブスクリプションのステータス変更時（キャンセルなど）
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      // サブスクリプション削除時
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error(`Error handling webhook event: ${(error as Error).message}`);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// サブスクリプション作成時の処理
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const subscriptionId = subscription.id;

  // カスタマーのメタデータからユーザーIDを取得
  const customer = await stripe.customers.retrieve(customerId as string);
  const userId = (customer as Stripe.Customer).metadata?.userId;

  if (!userId) {
    console.error(`No userId found in customer metadata: ${customerId}`);
    return;
  }

  // ユーザーの課金情報を更新
  await updateUserSubscription(
    userId,
    status as UserPoints['subscriptionStatus'],
    customerId as string,
    subscriptionId
  );

  // サブスクリプションがアクティブまたはトライアル中の場合、ポイントを付与
  if (status === 'active' || status === 'trialing') {
    await updateUserPoints(
      userId,
      PREMIUM_POINTS_PER_MONTH,
      'subscription',
      'サブスクリプション開始ボーナス'
    );
  }
}

// サブスクリプション更新時の処理（毎月の課金）
async function handleSubscriptionRenewed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer;

  // カスタマーのメタデータからユーザーIDを取得
  const customer = await stripe.customers.retrieve(customerId as string);
  const userId = (customer as Stripe.Customer).metadata?.userId;

  if (!userId) {
    console.error(`No userId found in customer metadata: ${customerId}`);
    return;
  }

  // 月額ポイントを付与
  await updateUserPoints(
    userId,
    PREMIUM_POINTS_PER_MONTH,
    'subscription',
    '月額サブスクリプションポイント'
  );
}

// サブスクリプションのステータス変更時の処理
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const subscriptionId = subscription.id;

  // カスタマーのメタデータからユーザーIDを取得
  const customer = await stripe.customers.retrieve(customerId as string);
  const userId = (customer as Stripe.Customer).metadata?.userId;

  if (!userId) {
    console.error(`No userId found in customer metadata: ${customerId}`);
    return;
  }

  // ユーザーの課金情報を更新
  await updateUserSubscription(
    userId,
    status as UserPoints['subscriptionStatus'],
    customerId as string,
    subscriptionId
  );
}

// サブスクリプション削除時の処理
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer;

  // カスタマーのメタデータからユーザーIDを取得
  const customer = await stripe.customers.retrieve(customerId as string);
  const userId = (customer as Stripe.Customer).metadata?.userId;

  if (!userId) {
    console.error(`No userId found in customer metadata: ${customerId}`);
    return;
  }

  // ユーザーの課金情報を更新
  await updateUserSubscription(
    userId,
    'canceled' as UserPoints['subscriptionStatus'],
    customerId as string
  );
}
