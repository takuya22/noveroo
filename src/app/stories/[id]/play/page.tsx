"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StoryPlayer from '@/features/story/components/StoryPlayer';
import { Story } from '@/utils/storyModel';

export default function PlayStoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ストーリーデータを取得
  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/stories/${storyId}`);
        console.log('Response:', response);
        console.log('Response:', response.ok);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('ストーリーが見つかりません');
          }
          throw new Error('ストーリーの読み込みに失敗しました');
        }
        
        const data = await response.json();
        setStory(data);
      } catch (err: any) {
        console.error('Error fetching story:', err);
        setError(err.message || 'ストーリーの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();
  }, [storyId]);
  
  // 再生完了時の処理
  const handlePlayComplete = (results: any) => {
    console.log('Play completed with results:', results);
    // 必要に応じて統計データを送信するなどの処理を追加
  };
  
  // プレイ画面を閉じる
  const handleClose = () => {
    router.push(`/stories/${storyId}`);
  };
  
  // ローディング表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[var(--primary)] border-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white">ストーリーを読み込み中...</p>
        </div>
      </div>
    );
  }
  
  // エラー表示
  if (error || !story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mt-4">エラーが発生しました</h2>
            <p className="text-gray-600 mt-2">{error || 'ストーリーの読み込みに失敗しました'}</p>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
            >
              ダッシュボードに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // プレイヤーを表示
  return <StoryPlayer story={story} onClose={handleClose} onComplete={handlePlayComplete} />;
}
