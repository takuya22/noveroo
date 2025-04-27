import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { checkAndRefillTickets } from '@/utils/ticketService';
import { authOptions } from '@/lib/authOptions';

/**
 * ユーザーのチケット情報を取得するAPIエンドポイント
 */
export async function GET() {
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
  } catch (error: unknown) {
    console.error('Error getting ticket info:', (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || 'チケット情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
