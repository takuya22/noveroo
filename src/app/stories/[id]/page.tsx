"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Story } from '@/utils/storyModel';
import { PrimaryButton } from '@/ui/buttons/PrimaryButton';
import { SecondaryButton } from '@/ui/buttons/SecondaryButton';
import { useAuthContext } from '@/providers/AuthProvider';

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthContext();
  const storyId = params.id as string;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  
  // ストーリーデータを取得
  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/stories/${storyId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('ストーリーが見つかりません');
          }
          throw new Error('ストーリーの読み込みに失敗しました');
        }
        
        const data = await response.json();
        setStory(data.story);
        
        // ユーザーがストーリーの作者かどうかを確認
        if (isAuthenticated && user && data.story.metadata?.creator?.userId) {
          setIsOwner(user.uid === data.story.metadata.creator.userId);
        }
      } catch (err: any) {
        console.error('Error fetching story:', err);
        setError(err.message || 'ストーリーの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();
  }, [storyId, isAuthenticated, user]);
  
  // プレイボタンを押したときの処理
  const handlePlay = () => {
    router.push(`/stories/${storyId}/play`);
  };
  
  // 編集ボタンを押したときの処理
  const handleEdit = () => {
    router.push(`/dashboard/stories/${storyId}/edit`);
  };
  
  // ローディング表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[var(--primary)] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">ストーリーを読み込み中...</p>
        </div>
      </div>
    );
  }
  
  // エラー表示
  if (error || !story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mt-4">エラーが発生しました</h2>
            <p className="text-gray-600 mt-2">{error || 'ストーリーの読み込みに失敗しました'}</p>
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors">
                トップページに戻る
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
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
        {/* ナビゲーション */}
        <div className="mb-8">
          <Link href="/" className="text-[var(--primary)] hover:underline">
            トップページ
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">ストーリー</span>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{story.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{story.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {story.metadata?.category && (
                  <span className="inline-block px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] text-sm font-medium rounded-full">
                    {categoryLabels[story.metadata.category as keyof typeof categoryLabels] || story.metadata.category}
                  </span>
                )}
                
                {story.metadata?.difficulty && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    難易度: {story.metadata.difficulty}
                  </span>
                )}
                
                {story.metadata?.tags && story.metadata.tags.map((tag, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {story.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <PrimaryButton onClick={handlePlay} className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  プレイする
                </PrimaryButton>
                
                {isOwner && (
                  <SecondaryButton onClick={handleEdit} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集する
                  </SecondaryButton>
                )}
              </div>
              
              {/* プレビュー画像（サムネイル） */}
              {story.thumbnailURL && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">ストーリープレビュー</h2>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={story.thumbnailURL} 
                      alt={`${story.title}のプレビュー`} 
                      className="w-full object-cover h-64"
                    />
                  </div>
                </div>
              )}
              
              {/* 作成情報 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">作成情報</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">作成者</div>
                  <div className="text-gray-700">{story.metadata?.creator?.username || '匿名'}</div>
                  
                  <div className="text-gray-500">作成日</div>
                  <div className="text-gray-700">
                    {story.metadata?.createdAt 
                      ? new Date(story.metadata.createdAt as any).toLocaleDateString('ja-JP')
                      : '不明'
                    }
                  </div>
                  
                  <div className="text-gray-500">最終更新</div>
                  <div className="text-gray-700">
                    {story.metadata?.updatedAt 
                      ? new Date(story.metadata.updatedAt as any).toLocaleDateString('ja-JP')
                      : '不明'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">クイックアクセス</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={handlePlay}
                  className="w-full flex items-center px-4 py-3 bg-[var(--primary-light)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  通常版をプレイ
                </button>
                
                <button 
                  onClick={() => router.push(`/stories/${storyId}/play?lang=en`)}
                  className="w-full flex items-center px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  英語版をプレイ
                </button>
                
                {isOwner && (
                  <button 
                    onClick={handleEdit}
                    className="w-full flex items-center px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集する
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/stories/${storyId}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('URLがクリップボードにコピーされました');
                  }}
                  className="w-full flex items-center px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  共有する
                </button>
              </div>
            </div>
            
            {/* 関連ストーリー（実装は将来的に） */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">おすすめストーリー</h2>
              <p className="text-gray-600 text-sm">
                このストーリーに興味を持った方には、以下のストーリーもおすすめです。
              </p>
              <div className="mt-4 text-center py-8">
                <p className="text-gray-500 text-sm">
                  おすすめストーリーは現在準備中です
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
