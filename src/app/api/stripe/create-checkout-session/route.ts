import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { stripe, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe';
import { getUserPoints } from '@/utils/pointsService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authOptions } from '@/lib/authOptions';

export async function POST() {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // ユーザーのポイント情報を取得
    const userPoints = await getUserPoints(userId);
    let customerId = userPoints?.stripeCustomerId;

    // Stripeのカスタマーが存在しない場合は作成
    if (!customerId) {
      const customerData = {
        metadata: {
          userId: userId,
        },
        email: session.user.email || undefined,
        name: session.user.name || undefined,
      };

      const customer = await stripe.customers.create(customerData);
      customerId = customer.id;

      // カスタマーIDをユーザーのポイント情報に保存
      const userPointsRef = doc(db, 'userPoints', userId);
      await setDoc(userPointsRef, { stripeCustomerId: customerId }, { merge: true });
    }

    // Checkout Sessionを作成
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription?canceled=true`,
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
