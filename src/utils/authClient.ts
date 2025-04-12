// クライアント側の認証ユーティリティ - NextAuth.js版
import { signIn, signOut } from 'next-auth/react';

/**
 * Googleアカウントでログイン
 * @returns ログイン結果
 */
export const loginWithGoogle = async () => {
  try {
    // NextAuth.jsのsignIn関数を使用
    const result = await signIn('google', { callbackUrl: '/dashboard', redirect: false });
    
    if (!result?.ok) {
      throw new Error(result?.error || 'ログイン処理に失敗しました');
    }
    
    // ログイン成功
    return {
      success: true,
      redirectUrl: result.url,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'ログインに失敗しました',
    };
  }
};

/**
 * ログアウト
 * @returns ログアウト結果
 */
export const logout = async () => {
  try {
    // NextAuth.jsのsignOut関数を使用
    await signOut({ callbackUrl: '/' });
    
    // ログアウト成功
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message || 'ログアウトに失敗しました',
    };
  }
};
