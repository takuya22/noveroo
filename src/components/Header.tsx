"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  // 必要に応じてプロパティを追加
}

export default function Header({}: HeaderProps) {
  const { user, signOut } = useAuthContext();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 画面外クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
      if (mobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen, mobileMenuOpen]);

  // 現在のパスに基づいてナビゲーションアイテムがアクティブかどうかを判断
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#FBFBFB"/>
                  <path d="M9 9L23 9C23.5523 9 24 9.44772 24 10V22C24 22.5523 23.5523 23 23 23H9C8.44772 23 8 22.5523 8 22V10C8 9.44772 8.44772 9 9 9Z" stroke="#34A853" strokeWidth="2"/>
                  <path d="M12 13H20" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 17H18" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#34a853] to-[#4285f4]">Noveroo</span>
              </div>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-[#34a853] bg-[#f0f9f2]' 
                  : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
              }`}
            >
              ダッシュボード
            </Link>
            <Link 
              href="/stories" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/stories') 
                  ? 'text-[#34a853] bg-[#f0f9f2]' 
                  : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
              }`}
            >
              パブリックストーリー
            </Link>
            <Link 
              href="/dashboard/create" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard/create') 
                  ? 'text-[#34a853] bg-[#f0f9f2]' 
                  : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
              }`}
            >
              新規作成
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* 新規作成ボタン（モバイル表示時も表示） */}
            <Link 
              href="/dashboard/create"
              className="flex items-center justify-center px-3 py-1.5 bg-[#34a853] rounded-full text-white text-sm font-medium hover:bg-[#2d8f46] transition-colors"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">新しいストーリー</span>
            </Link>

            {/* モバイルメニューボタン */}
            <button
              className="md:hidden mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={mobileMenuOpen ? "M6 18L18 6M6 6L18 18" : "M4 6H20M4 12H20M4 18H20"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* プロフィールボタン */}
            {user ? (
              <div className="relative profile-menu-container">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'ユーザー'}
                        className="h-8 w-8 object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-600">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                </button>

                {/* プロフィールドロップダウン */}
                {profileMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{user?.displayName || 'ユーザー'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          signOut();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          ログアウト
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-[#34a853] font-medium text-sm"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden mobile-menu-container animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white shadow-lg">
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'text-[#34a853] bg-[#f0f9f2]'
                  : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ダッシュボード
            </Link>
            <Link
              href="/stories"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/stories')
                  ? 'text-[#34a853] bg-[#f0f9f2]'
                  : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              パブリックストーリー
            </Link>
            <Link
              href="/dashboard/create"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard/create')
                  ? 'text-[#34a853] bg-[#f0f9f2]'
                  : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              新規作成
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
