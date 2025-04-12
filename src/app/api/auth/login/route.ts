// このファイルは不要になりました - NextAuth.jsを使用
// NextAuth.jsがログイン処理を自動的に処理します
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'このエンドポイントは使用されません。NextAuth.jsを使用してください。' },
    { status: 404 }
  );
}
