"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { useStories } from '@/hooks/useStories';
import Link from 'next/link';

// コンポーネントのインポート
import StoryList from '@/features/dashboard/components/StoryList';
import EmptyState from '@/features/dashboard/components/EmptyState';
import Header from '@/components/Header';
import { AuthModal } from '@/features/auth/components/AuthModal';

// SearchParamsを使用する部分を別コンポーネントに分離
function DashboardContent() {
  const { loading, isAuthenticated } = useAuthContext();
  const { stories, loading: storiesLoading } = useStories();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  // 公開・非公開のフィルタリング用の状態
  const [filterMode, setFilterMode] = useState<'all' | 'public'>('all');
  
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-[#34a853] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 統計情報
  const totalStories = stories ? stories.length : 0;
  const publicStories = stories ? stories.filter(story => story.metadata?.visibility === 'public').length : 0;

  // フィルタリングされたストーリー
  const filteredStories = stories ? (
    filterMode === 'all' 
      ? stories 
      : stories.filter(story => story.metadata?.visibility === 'public')
  ).sort((a, b) => {
    // 作成日順に並び替え（新しい順）
    const aDate = a.metadata?.createdAt ? new Date(a.metadata.createdAt as Date) : new Date(0);
    const bDate = b.metadata?.createdAt ? new Date(b.metadata.createdAt as Date) : new Date(0);
    return bDate.getTime() - aDate.getTime();
  }) : [];

  // 以下は認証済みユーザー向けの表示内容
  return (
    <div className="min-h-screen bg-white pt-[65px]">
      <Header />
      
      {/* 認証モーダル */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal}
        initialMode="login"
      />
      
      {/* 認証済みの場合のみメインコンテンツを表示 */}
      {isAuthenticated && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {success && sessionId && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              <p>サブスクリプションが正常に開始されました！</p>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">マイストーリー</h1>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center px-4 py-2 bg-[#34a853] text-white text-sm font-medium rounded hover:bg-[#2d8f46] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                新規作成
              </Link>
            </div>
            
            <div className="flex space-x-6 mb-6">
              <button 
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 ${
                  filterMode === 'all' 
                    ? 'border-b-2 border-[#34a853] text-[#34a853] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                すべて ({totalStories})
              </button>
              <button 
                onClick={() => setFilterMode('public')}
                className={`px-4 py-2 ${
                  filterMode === 'public' 
                    ? 'border-b-2 border-[#34a853] text-[#34a853] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                公開中 ({publicStories})
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              {filteredStories.length > 0 ? (
                <StoryList stories={filteredStories} />
              ) : (
                <div className="py-12">
                  <EmptyState />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <Link
                href="/stories"
                className="text-[#34a853] hover:underline text-sm"
              >
                公開ストーリーを閲覧
              </Link>
              
              <div className="text-sm text-gray-500">
                合計: {totalStories}件のストーリー
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

// メインコンポーネント
export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-[#34a853] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}