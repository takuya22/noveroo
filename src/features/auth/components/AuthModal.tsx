"use client";

import React, { useState } from 'react';
import { Modal } from '../../../ui/modals/Modal';
import { useAuthContext } from '../../../providers/AuthProvider';

export type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { signInWithGoogle } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setError(err.message || 'Google認証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={initialMode === 'login' ? 'ログイン' : 'アカウント作成'}
    >
      <div className="w-full space-y-6 py-4">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {initialMode === 'login' 
              ? 'Googleアカウントを使ってログインしてください' 
              : 'Googleアカウントを使って簡単に登録できます'}
          </p>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
        </div>
        
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          
          <span className="text-gray-700 font-medium">
            {loading 
              ? '処理中...' 
              : (initialMode === 'login' ? 'Googleでログイン' : 'Googleで登録')}
          </span>
        </button>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {initialMode === 'login'
              ? 'ログインすることで、利用規約とプライバシーポリシーに同意したことになります。'
              : '登録することで、利用規約とプライバシーポリシーに同意したことになります。'}
          </p>
        </div>
      </div>
    </Modal>
  );
};
