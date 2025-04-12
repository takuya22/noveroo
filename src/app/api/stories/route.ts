import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserStories } from '@/utils/firebase';

/**
 * ユーザーのストーリー一覧を取得するAPI
 */
export async function GET(req: NextRequest) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    
    // 認証されていない場合はエラーを返す
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    
    // ストーリー一覧を取得
    const stories = await getUserStories(userId);
    
    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: error.message || 'ストーリー取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
