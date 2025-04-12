"use client";

import React, { useState } from 'react';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';

interface LoginFormProps {
  onSuccess?: () => void;
  onToggleForm?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Firebase Authentication will be implemented here
      console.log('Login with:', email, password);
      
      // Simulate success for now
      setTimeout(() => {
        setLoading(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary-light)] border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              ログイン状態を保存
            </label>
          </div>
          
          <a href="#" className="text-sm text-[var(--primary)] hover:underline">
            パスワードを忘れた場合
          </a>
        </div>
        
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            className="w-full py-2 px-4"
            disabled={loading}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </PrimaryButton>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない場合は
          <button
            onClick={onToggleForm}
            className="ml-1 text-[var(--primary)] hover:underline font-medium"
          >
            新規登録
          </button>
        </p>
      </div>
    </div>
  );
};
