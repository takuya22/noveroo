"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../ui/buttons/SecondaryButton';
import { AuthModal, AuthMode } from '../../auth/components/AuthModal';
import { useAuthContext } from '../../../providers/AuthProvider';

export const Header = () => {
  const { user, loading, signOut } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigation = [
    { name: '特徴', href: '#features' },
    { name: 'テンプレート', href: '#templates' },
    { name: 'ギャラリー', href: '#gallery' },
    { name: '料金', href: '#pricing' },
  ];

  // クリックイベントのハンドラー
  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  // プロフィールメニューの開閉
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // 画面外のクリックでプロフィールメニューを閉じる
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
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="ml-3 text-xl font-bold text-gray-800">Noveroo</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">メニューを開く</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="relative flex items-center text-sm font-medium text-gray-600 hover:text-[var(--primary)] after:absolute after:bottom-[-1.5rem] after:left-0 after:right-0 after:h-[3px] after:w-full after:scale-x-0 after:bg-[var(--primary)] after:transition-transform hover:after:scale-x-100">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          {loading ? (
            <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-md"></div>
          ) : user ? (
            <div className="flex items-center gap-x-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-[var(--primary)]"
              >
                マイダッシュボード
              </Link>
              <div className="relative profile-menu-container">
                <button 
                  className="flex items-center gap-x-2"
                  onClick={toggleProfileMenu}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-[var(--gray-100)] flex items-center justify-center overflow-hidden border border-gray-200">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL}
                        alt={user.displayName || 'ユーザー'}
                        className="h-8 w-8 object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.displayName || 'ユーザー'}
                  </span>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path 
                      fillRule="evenodd" 
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      プロフィール
                    </Link>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => openAuthModal('login')}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-[var(--primary)]"
              >
                ログイン
              </button>
              <PrimaryButton 
                className="rounded-md px-4 py-2 text-sm shadow-sm"
                onClick={() => openAuthModal('signup')}
              >
                無料で始める
              </PrimaryButton>
            </>
          )}
        </div>
      </nav>
      
      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    N
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-800">Noveroo</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">メニューを閉じる</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[var(--primary)] border-b border-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {loading ? (
                      <div className="animate-pulse h-10 bg-gray-200 rounded-md mb-4"></div>
                    ) : user ? (
                      <>
                        <Link 
                          href="/dashboard" 
                          className="block w-full text-left px-3 py-3 text-base font-medium text-[var(--primary)] border-b border-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          マイダッシュボード
                        </Link>
                        <Link 
                          href="/profile" 
                          className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-[var(--primary)] border-b border-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          プロフィール設定
                        </Link>
                        <button
                          className="mt-6 block w-full rounded-md bg-gray-100 px-4 py-3 text-center text-base font-medium text-gray-700 hover:bg-gray-200 shadow-sm"
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          ログアウト
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-[var(--primary)] border-b border-gray-100"
                          onClick={() => openAuthModal('login')}
                        >
                          ログイン
                        </button>
                        <button
                          className="mt-6 block w-full rounded-md bg-[var(--primary)] px-4 py-3 text-center text-base font-medium text-white hover:bg-[var(--primary-dark)] shadow-sm"
                          onClick={() => openAuthModal('signup')}
                        >
                          無料で始める
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
};
