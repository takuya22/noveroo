"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { useStories } from '@/hooks/useStories';

// コンポーネントのインポート
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import StoryList from '@/features/dashboard/components/StoryList';
import EmptyState from '@/features/dashboard/components/EmptyState';
import PointsDisplay from '@/features/dashboard/components/PointsDisplay';

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const { stories, loading: storiesLoading } = useStories();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URLパラメータを確認（サブスクリプション成功後のリダイレクト）
  const success = searchParams.get('success');
  const sessionId = searchParams.get('session_id');

  // 認証されていないユーザーをホームページにリダイレクト
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // ローディング中の表示
  if (loading || storiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[var(--primary)] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合は何も表示せずリダイレクト待ち
  if (!isAuthenticated) {
    return null;
  }

  // 以下は認証済みユーザー向けの表示内容
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {success && sessionId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="font-medium">サブスクリプションが正常に開始されました！ポイントが追加されました。</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">マイストーリー</h1>
                <button 
                  onClick={() => router.push('/dashboard/create')}
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                >
                  新しいストーリーを作る
                </button>
              </div>
              
              {/* ストーリーがない場合はEmptyState、ある場合はStoryListを表示 */}
              {stories && stories.length > 0 ? <StoryList stories={stories} /> : <EmptyState />}
            </div>
            
            <div>
              <PointsDisplay className="mb-6" />
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">クイックリンク</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/subscription" 
                      className="flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      サブスクリプション管理
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/stories" 
                      className="flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      パブリックストーリー
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/dashboard/create" 
                      className="flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      新規ストーリー作成
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
