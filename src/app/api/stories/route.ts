import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPublicStories, getUserStories } from '@/utils/storyService';

/**
 * ストーリー一覧を取得するAPIエンドポイント
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'public'; // 'public', 'user'
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    let stories;
    
    if (type === 'user') {
      // ユーザーのストーリー一覧を取得（認証が必要）
      if (!userId) {
        return NextResponse.json(
          { error: 'この操作には認証が必要です' },
          { status: 401 }
        );
      }
      
      stories = await getUserStories(userId);
    } else {
      // 公開されたストーリー一覧を取得
      stories = await getPublicStories(limit);
    }
    
    return NextResponse.json({
      success: true,
      stories
    });
  } catch (error: any) {
    console.error('Stories fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'ストーリー一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
