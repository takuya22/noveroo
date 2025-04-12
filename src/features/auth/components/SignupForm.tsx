"use client";

import React, { useState } from 'react';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';

interface SignupFormProps {
  onSuccess?: () => void;
  onToggleForm?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Firebase Authentication will be implemented here
      console.log('Signup with:', name, email, password);
      
      // Simulate success for now
      setTimeout(() => {
        setLoading(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('アカウント作成に失敗しました。別のメールアドレスを試すか、後でもう一度お試しください。');
      console.error('Signup error:', err);
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            お名前
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="山田 太郎"
          />
        </div>
        
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="8文字以上"
          />
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード（確認）
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="パスワードを再入力"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="agree-terms"
            type="checkbox"
            required
            className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary-light)] border-gray-300 rounded"
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
            <a href="#" className="text-[var(--primary)] hover:underline">利用規約</a>と<a href="#" className="text-[var(--primary)] hover:underline">プライバシーポリシー</a>に同意します
          </label>
        </div>
        
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            className="w-full py-2 px-4"
            disabled={loading}
          >
            {loading ? 'アカウント作成中...' : 'アカウント作成'}
          </PrimaryButton>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちの場合は
          <button
            onClick={onToggleForm}
            className="ml-1 text-[var(--primary)] hover:underline font-medium"
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  );
};
