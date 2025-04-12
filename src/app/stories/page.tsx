"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Story } from '@/utils/storyModel';
import { SecondaryButton } from '@/ui/buttons/SecondaryButton';
import { useAuthContext } from '@/providers/AuthProvider';

export default function StoriesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  
  // ストーリー一覧を取得
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/stories?type=public');
        
        if (!response.ok) {
          throw new Error('ストーリー一覧の読み込みに失敗しました');
        }
        
        const data = await response.json();
        setStories(data.stories || []);
      } catch (err: any) {
        console.error('Error fetching stories:', err);
        setError(err.message || 'ストーリー一覧の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStories();
  }, []);
  
  // カテゴリのラベルマッピング
  const categoryLabels = {
    'education': '教育',
    'entertainment': 'エンターテイメント',
    'business': 'ビジネス',
    'science': '科学',
    'history': '歴史',
    'language': '語学',
    'other': 'その他'
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="font-bold text-xl text-[var(--primary)]">Noveroo</div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <SecondaryButton>
                  ダッシュボード
                </SecondaryButton>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <SecondaryButton>
                  ログイン
                </SecondaryButton>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">公開ストーリー</h1>
          <p className="text-gray-600 mt-2">
            みんなが作成したインタラクティブストーリーを体験しましょう
          </p>
        </div>
        
        {/* ローディング表示 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-t-[var(--primary)] border-gray-200 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">ストーリーを読み込み中...</p>
            </div>
          </div>
        )}
        
        {/* エラー表示 */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-medium">エラーが発生しました</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* ストーリー一覧 */}
        {!loading && !error && stories.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mt-4">公開されているストーリーはありません</h2>
            <p className="text-gray-500 mt-2">現在公開されているストーリーはありません。あなたが最初のストーリーを作成しましょう！</p>
            <div className="mt-6">
              <Link href="/dashboard/create">
                <SecondaryButton>
                  ストーリーを作成する
                </SecondaryButton>
              </Link>
            </div>
          </div>
        )}
        
        {!loading && !error && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <div key={story.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* サムネイル */}
                <div className="h-48 bg-gray-100 relative">
                  {story.thumbnailURL ? (
                    <img
                      src={story.thumbnailURL}
                      alt={`${story.title}のサムネイル`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary-light)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  
                  {/* カテゴリタグ */}
                  {story.metadata?.category && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-block px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-800 rounded-md">
                        {categoryLabels[story.metadata.category as keyof typeof categoryLabels] || story.metadata.category}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* コンテンツ */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{story.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {story.metadata?.creator?.username || '匿名'}さんの作品
                    </div>
                    <button
                      onClick={() => router.push(`/stories/${story.id}`)}
                      className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
