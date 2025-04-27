import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserPoints } from '@/utils/pointsService';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // ユーザーのポイント情報を取得
    const userPoints = await getUserPoints(userId);
    
    if (!userPoints) {
      return NextResponse.json({ error: 'User points not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      isPremium: userPoints.isPremium || false,
      subscriptionStatus: userPoints.subscriptionStatus || 'none',
      totalPoints: userPoints.totalPoints || 0,
      lastPointsAddedAt: userPoints.lastPointsAddedAt || null,
      stripeCustomerId: userPoints.stripeCustomerId || null,
      stripeSubscriptionId: userPoints.stripeSubscriptionId || null,
    });
  } catch (error: unknown) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
