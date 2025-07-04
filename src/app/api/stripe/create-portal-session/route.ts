import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { stripe } from '@/lib/stripe';
import { getUserPoints } from '@/utils/pointsService';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions) as {
      user: {
        name: string;
        email: string;
        image: string;
        id: string;
      }
    };
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { returnUrl } = await req.json();

    // ユーザーのポイント情報を取得
    const userPoints = await getUserPoints(userId);
    const customerId = userPoints?.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found for this user' },
        { status: 404 }
      );
    }

    // カスタマーポータルセッションを作成
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000'}/subscription`,
    });

    return NextResponse.json({ portalUrl: portalSession.url });
  } catch (error: unknown) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
