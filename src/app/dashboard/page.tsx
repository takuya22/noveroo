"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { useStories } from '@/hooks/useStories';

// コンポーネントのインポート
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import StoryList from '@/features/dashboard/components/StoryList';
import EmptyState from '@/features/dashboard/components/EmptyState';

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const { stories, loading: storiesLoading } = useStories();
  const router = useRouter();

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
          <div className="flex items-center justify-between mb-8">
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
      </main>
    </div>
  );
}
