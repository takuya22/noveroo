"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { useStories } from '@/hooks/useStories';
import Link from 'next/link';

// コンポーネントのインポート
import StoryList from '@/features/dashboard/components/StoryList';
import EmptyState from '@/features/dashboard/components/EmptyState';
import PointsDisplay from '@/features/dashboard/components/PointsDisplay';
import Header from '@/features/common/components/Header';
import { AuthModal } from '@/features/auth/components/AuthModal';

export default function Dashboard() {
  const { loading, isAuthenticated } = useAuthContext();
  const { stories, loading: storiesLoading } = useStories();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // URLパラメータを確認
  const success = searchParams.get('success');
  const sessionId = searchParams.get('session_id');

  // 認証されていないユーザーにはモーダルを表示
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, isAuthenticated]);

  // 認証モーダルを閉じた時の処理
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    // モーダルを閉じた後はホームページにリダイレクト
    router.push('/');
  };

  // ローディング中の表示
  if (loading || storiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#34a853] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 以下は認証済みユーザー向けの表示内容
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />
      
      {/* 認証モーダル */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal}
        initialMode="login"
      />
      
      {/* 認証済みの場合のみメインコンテンツを表示 */}
      {isAuthenticated && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {success && sessionId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="font-medium">サブスクリプションが正常に開始されました！ポイントが追加されました。</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* サイドバー（デスクトップでは左側、モバイルでは上部） */}
            <div className="lg:col-span-1 space-y-6">
              <PointsDisplay className="" />
              
              {/* クイックリンクカード */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-md font-medium text-gray-900">クイックリンク</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    <li>
                      <Link href="/stories" className="group flex items-center text-gray-600 hover:text-[#34a853] transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-[#f0f9f2] text-[#34a853] group-hover:bg-[#34a853] group-hover:text-white transition-colors mr-3">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-medium">パブリックストーリー</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/create" className="group flex items-center text-gray-600 hover:text-[#34a853] transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-[#f0f9f2] text-[#34a853] group-hover:bg-[#34a853] group-hover:text-white transition-colors mr-3">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-medium">新規ストーリー作成</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* 統計カード（オプション） */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-md font-medium text-gray-900">統計</h3>
                </div>
                <div className="p-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">作成したストーリー</span>
                    <span className="font-medium text-gray-900">{stories ? stories.length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">公開ストーリー</span>
                    <span className="font-medium text-gray-900">
                      {stories ? stories.filter(story => story.metadata?.visibility === 'public').length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* メインコンテンツ */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-900">マイストーリー</h2>
                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center px-3 py-1.5 bg-[#34a853] text-white text-sm font-medium rounded-full hover:bg-[#2d8f46] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    新しいストーリー
                  </Link>
                </div>
                
                <div className="p-6">
                  {/* ストーリーがない場合はEmptyState、ある場合はStoryListを表示 */}
                  {stories && stories.length > 0 ? (
                    <StoryList stories={stories} />
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
