import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

// Firebase Admin SDKの初期化
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET() {
  try {
    // セッションクッキーからトークンを取得
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: '未認証' },
        { status: 401 }
      );
    }
    
    // Firebase Admin SDK でトークンを検証
    const auth = getAuth();
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    
    // ユーザー情報を取得
    const user = await auth.getUser(decodedToken.uid);
    
    // 必要なユーザー情報のみ返す
    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  } catch (error: unknown) {
    console.error('User info error:', error);
    
    // セッションクッキーを削除
    const cookieStore = await cookies();
    cookieStore.delete('session');

    // error が Error インスタンスかどうかチェック
    const errorMessage = error instanceof Error
      ? error.message
      : '認証情報の取得に失敗しました';

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}
