import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserTickets, checkAndRefillTickets } from '@/utils/ticketService';

/**
 * ユーザーのチケット情報を取得するAPIエンドポイント
 */
export async function GET(req: NextRequest) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // チケット情報を取得（自動補充チェック付き）
    const ticketInfo = await checkAndRefillTickets(userId);

    // レスポンス
    return NextResponse.json({
      remainingCount: ticketInfo.remainingCount,
      lastRefillDate: ticketInfo.lastRefillDate,
    });
  } catch (error: any) {
    console.error('Error getting ticket info:', error);
    return NextResponse.json(
      { error: error.message || 'チケット情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
