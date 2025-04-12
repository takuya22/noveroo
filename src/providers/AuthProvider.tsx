"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

// 認証コンテキストの型定義
export interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  isAuthenticated: boolean;
  refreshStories: () => Promise<void>;
  storiesLoading: boolean;
}

// 認証コンテキストの作成（デフォルト値はnullで初期化）
const AuthContext = createContext<AuthContextType | null>(null);

// 認証プロバイダーのpropsの型定義
interface AuthProviderProps {
  children: ReactNode;
}

// 認証プロバイダーコンポーネント - NextAuthと統合
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // useAuthは新しいNextAuth対応のフックを使用
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// 認証コンテキストを使用するためのカスタムフック
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
