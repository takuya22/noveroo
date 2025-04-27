"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthResult } from '@/features/auth/types/AuthModel';

// 認証コンテキストの型定義
interface AuthContextType {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    uid?: string | null;
  } | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  isAuthenticated: boolean;
}

// 認証コンテキストの作成（デフォルト値はnullで初期化）
const AuthContext = createContext<AuthContextType | null>(null);

// 認証プロバイダーのpropsの型定義
interface AuthProviderProps {
  children: ReactNode;
}

// 認証プロバイダーコンポーネント
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
