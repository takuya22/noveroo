"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export default function DashboardHeader() {
  const { user, signOut } = useAuthContext();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // 画面外クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">Noveroo</span>
          </Link>

          {/* ナビゲーションリンク */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-[var(--primary)] transition-colors font-medium">
              ダッシュボード
            </Link>
            <Link href="/stories" className="text-gray-700 hover:text-[var(--primary)] transition-colors font-medium">
              パブリックストーリー
            </Link>
            <Link href="/subscription" className="text-gray-700 hover:text-[var(--primary)] transition-colors font-medium">
              サブスクリプション
            </Link>
          </nav>

          {/* プロフィールメニュー */}
          <div className="relative profile-menu-container">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
            >
              <div className="h-8 w-8 rounded-full bg-[var(--gray-100)] flex items-center justify-center overflow-hidden border border-gray-200">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'ユーザー'}
                    className="h-8 w-8 object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.displayName || 'ユーザー'}
              </span>
              <svg className="hidden md:block h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* ドロップダウンメニュー */}
            {profileMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link
                  href="/subscription"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  サブスクリプション
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
