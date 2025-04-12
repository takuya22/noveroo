import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// GETリクエスト：個別のストーリーを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const p = await params;
  const storyId = p.id;
  const session = await getServerSession(authOptions);

  // 認証チェック
  if (!session || !session.user) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    );
  }

  try {
    // Firestoreからストーリーを取得
    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);

    if (!storySnap.exists()) {
      return NextResponse.json(
        { error: 'ストーリーが見つかりませんでした' },
        { status: 404 }
      );
    }

    const storyData = storySnap.data();

    // アクセス権限チェック（非公開ストーリーは作成者のみアクセス可能）
    if (
      storyData.metadata?.visibility !== 'public' && 
      storyData.metadata?.creator?.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'このストーリーにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    // レスポンスを返す
    return NextResponse.json({
      id: storyId,
      ...storyData
    });
  } catch (error: any) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'ストーリーの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// PUTリクエスト：ストーリーを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const storyId = params.id;
  const session = await getServerSession(authOptions);

  // 認証チェック
  if (!session || !session.user) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    );
  }

  try {
    // リクエストボディからデータを取得
    const storyData = await request.json();
    
    // Firestoreからストーリーを取得して所有者を確認
    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);

    if (!storySnap.exists()) {
      return NextResponse.json(
        { error: 'ストーリーが見つかりませんでした' },
        { status: 404 }
      );
    }

    const existingStory = storySnap.data();
    
    // 所有者チェック
    if (existingStory.metadata?.creator?.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'このストーリーを編集する権限がありません' },
        { status: 403 }
      );
    }

    // 更新データを準備
    const updatedAt = new Date();
    const updateData = {
      ...storyData,
      metadata: {
        ...storyData.metadata,
        updatedAt
      }
    };

    // Firestoreでストーリーを更新
    await updateDoc(storyRef, updateData);

    // 成功レスポンスを返す
    return NextResponse.json({
      id: storyId,
      ...updateData
    });
  } catch (error: any) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: 'ストーリーの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// DELETEリクエスト：ストーリーを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const storyId = params.id;
  const session = await getServerSession(authOptions);

  // 認証チェック
  if (!session || !session.user) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    );
  }

  try {
    // Firestoreからストーリーを取得して所有者を確認
    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);

    if (!storySnap.exists()) {
      return NextResponse.json(
        { error: 'ストーリーが見つかりませんでした' },
        { status: 404 }
      );
    }

    const storyData = storySnap.data();
    
    // 所有者チェック
    if (storyData.metadata?.creator?.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'このストーリーを削除する権限がありません' },
        { status: 403 }
      );
    }

    // 論理削除（完全に削除ではなく、状態を変更）
    await updateDoc(storyRef, {
      'metadata.isDeleted': true,
      'metadata.updatedAt': new Date()
    });

    // 成功レスポンスを返す
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'ストーリーの削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
