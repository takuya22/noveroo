"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { AuthModal, AuthMode } from '@/features/auth/components/AuthModal';
import Image from 'next/image';

export default function Header({ isLandingPage = false }) {
  const { user, loading, signOut } = useAuthContext();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const pathname = usePathname();

  // ランディングページ用のナビゲーションリンク
  const landingNavigation = [
    { name: '特徴', href: '#features' },
    { name: 'ストーリー', href: '/stories' },
    { name: 'ダッシュボード', href: '/dashboard' },
    // { name: '料金', href: '#pricing' },
  ];

  // アプリケーション内のナビゲーションリンク
  const appNavigation = [
    { name: 'ダッシュボード', href: '/dashboard' },
    { name: 'ストーリー', href: '/stories' },
    { name: '新規作成', href: '/dashboard/create' },
  ];

  // 現在のページに応じたナビゲーション
  const navigation = isLandingPage ? landingNavigation : appNavigation;

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
    if (path.startsWith('#')) return false; // ランディングページのアンカーリンクは常に非アクティブ
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // 認証モーダルを開く
  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  // ヘッダーのスタイル（ランディングページかどうかで変わる）
  const headerStyles = isLandingPage 
    ? "fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm" 
    : "bg-white border-b border-gray-200";

  return (
    <header className={headerStyles}>
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
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-[#34a853] bg-[#f0f9f2]'
                    : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {/* モバイルメニューボタン */}
            <button
              className="md:hidden mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={mobileMenuOpen ? "M6 18L18 6M6 6L18 18" : "M4 6H20M4 12H20M4 18H20"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* ユーザー認証表示 */}
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="relative profile-menu-container">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'ユーザー'}
                        className="h-8 w-8 object-cover"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-600">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                </button>

                {/* プロフィールドロップダウン */}
                {profileMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{user?.name || 'ユーザー'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          ダッシュボード
                        </div>
                      </Link>
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
              // 未ログインの場合はログインボタンを表示
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-sm font-medium text-gray-600 hover:text-[#34a853] transition-colors"
                >
                  ログイン
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-3 py-1.5 bg-[#34a853] rounded-full text-white text-sm font-medium hover:bg-[#2d8f46] transition-colors"
                >
                  無料で始める
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden mobile-menu-container animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'text-[#34a853] bg-[#f0f9f2]'
                    : 'text-gray-600 hover:text-[#34a853] hover:bg-[#f0f9f2]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <button
                  onClick={() => openAuthModal('login')}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600"
                >
                  ログイン
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="mt-2 block w-full px-3 py-2 text-base font-medium text-white bg-[#34a853] rounded-md hover:bg-[#2d8f46]"
                >
                  無料で始める
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 認証モーダル */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode}
      />
    </header>
  );
}
