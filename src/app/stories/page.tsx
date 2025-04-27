"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/features/common/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import { PrimaryButton } from '@/ui/buttons/PrimaryButton';

export default function StoriesPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleStories, setVisibleStories] = useState<number>(12);
  
  // カテゴリのラベルマッピング
  const categoryLabels = {
    'all': 'すべて',
    'education': '教育',
    'entertainment': 'エンターテイメント',
    'business': 'ビジネス',
    'science': '科学',
    'history': '歴史',
    'language': '語学',
    'other': 'その他'
  };
  
  // ストーリー一覧を取得
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/stories?type=public&limit=50');
        
        if (!response.ok) {
          throw new Error('ストーリー一覧の読み込みに失敗しました');
        }
        
        const data = await response.json();
        setStories(data.stories || []);
      } catch (err: unknown) {
        console.error('Error fetching stories:', (err as Error).message);
        setError((err as Error).message || 'ストーリー一覧の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStories();
  }, []);
  
  // カテゴリでフィルタリングされたストーリーを取得
  const filteredStories = selectedCategory === 'all'
    ? stories
    : stories.filter(story => story.metadata?.category === selectedCategory);
  
  // 「もっと見る」ボタンの処理
  const handleLoadMore = () => {
    setVisibleStories(prev => prev + 12);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* ヒーローセクション */}
        <div className="relative bg-gradient-to-r from-[var(--primary-light)] to-white">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
          <div className="container mx-auto px-6 py-16 relative">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                公開ストーリーコレクション
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                ユーザーが作成した様々なインタラクティブストーリーをプレイできます。教育用コンテンツやエンターテイメント、様々なジャンルのストーリーを楽しみましょう。
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/create">
                  <PrimaryButton className="rounded-md px-6 py-2.5 text-base font-medium shadow-md">
                    自分のストーリーを作る
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="container mx-auto px-6 py-12">
          {/* カテゴリフィルター */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">カテゴリーで絞り込む</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSelectedCategory(value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === value
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
          
          {/* ストーリーが0件の場合 */}
          {!loading && !error && filteredStories.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mt-4">
                {selectedCategory === 'all' 
                  ? '公開されているストーリーはありません' 
                  : `${categoryLabels[selectedCategory as keyof typeof categoryLabels]}カテゴリーのストーリーはありません`}
              </h2>
              <p className="text-gray-500 mt-2">
                {selectedCategory === 'all'
                  ? 'あなたが最初のストーリーを作成しましょう！'
                  : '別のカテゴリーを選択するか、あなたがこのカテゴリーの最初のストーリーを作成しましょう！'}
              </p>
              <div className="mt-6">
                <Link href="/dashboard/create">
                  <PrimaryButton>
                    ストーリーを作成する
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          )}
          
          {/* ストーリー一覧 */}
          {!loading && !error && filteredStories.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStories.slice(0, visibleStories).map((story: any) => (
                  <div 
                    key={story.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col"
                    onClick={() => router.push(`/stories/${story.id}`)}
                  >
                    {/* サムネイル */}
                    <div className="h-48 relative cursor-pointer">
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
                        <div className="absolute top-3 right-3">
                          <span className="inline-block px-2 py-1 bg-white/90 text-xs font-medium text-gray-800 rounded-md shadow-sm backdrop-blur-sm">
                            {categoryLabels[story.metadata.category as keyof typeof categoryLabels] || story.metadata.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* コンテンツ */}
                    <div className="p-5 flex-grow flex flex-col">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-[var(--primary)] cursor-pointer">{story.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{story.description}</p>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {story.metadata?.creator?.username || '匿名'}さんの作品
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/stories/${story.id}/play`);
                          }}
                          className="px-3 py-1.5 bg-[var(--primary)] text-white text-sm rounded-md hover:bg-[var(--primary-dark)] transition-colors flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>プレイ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* もっと見るボタン */}
              {filteredStories.length > visibleStories && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    もっと見る
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
