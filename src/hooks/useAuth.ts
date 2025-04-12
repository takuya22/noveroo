"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

/**
 * Auth.jsを使用した認証カスタムフック
 * ログイン状態とユーザー情報の取得、ログイン/ログアウト機能を提供
 */
export const useAuth = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [storiesLoading, setStoriesLoading] = useState<boolean>(false);

  // セッション状態が更新されたらローディング状態を更新
  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  // Googleでログイン
  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
      return { success: true };
    } catch (error: any) {
      setError(error.message || "ログインに失敗しました");
      return {
        success: false,
        error: error.message || "ログインに失敗しました",
      };
    }
  };

  // ログアウト
  const handleSignOut = async () => {
    setError(null);
    try {
      await signOut({ callbackUrl: "/" });
      return { success: true };
    } catch (error: any) {
      setError(error.message || "ログアウトに失敗しました");
      return {
        success: false,
        error: error.message || "ログアウトに失敗しました",
      };
    }
  };

  // 認証状態を返却
  return {
    user: session?.user || null,
    loading,
    error,
    storiesLoading,
    isAuthenticated: !!session,
    signInWithGoogle: loginWithGoogle,
    signOut: handleSignOut,
    refreshStories: async () => {
      if (!session?.user?.id) return;
      
      setStoriesLoading(true);
      try {
        const response = await fetch("/api/stories");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "ストーリー取得中にエラーが発生しました");
        }
        
        // 新しいストーリーデータは返さない (別のフックで管理)
      } catch (error) {
        console.error("Error refreshing stories:", error);
        setError(error.message);
      } finally {
        setStoriesLoading(false);
      }
    },
  };
};
