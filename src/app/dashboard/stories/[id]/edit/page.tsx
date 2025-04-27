"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import StoryEditor from '@/features/dashboard/components/StoryEditor';
import { Story } from '@/utils/storyModel';

export default function EditStory() {
  const { loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;
  
  const [storyData, setStoryData] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 認証されていないユーザーをホームページにリダイレクト
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // ストーリーデータを取得
  useEffect(() => {
    if (!storyId || !isAuthenticated) return;

    const fetchStory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'ストーリーの取得に失敗しました');
        }
        
        const data = await response.json();
        setStoryData(data);
      } catch (err: unknown) {
        console.error('Error fetching story:', err);
        setError('ストーリーの読み込み中にエラーが発生しました: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [storyId, isAuthenticated]);

  // ストーリーを保存
  const handleSave = async (updatedStory: Story) => {
    if (!storyId || !isAuthenticated) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStory),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存に失敗しました');
      }
      
      setSaveSuccess(true);
      setStoryData(updatedStory);
      
      // 3秒後に成功メッセージを消す
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      console.error('Error saving story:', err);
      setError('保存中にエラーが発生しました: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // ローディング中の表示
  if (loading || isLoading) {
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

  // エラーの表示
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">ストーリー編集</h1>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ダッシュボードに戻る
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ストーリーデータがない場合
  if (!storyData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">ストーリー編集</h1>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-600">ストーリーデータが見つかりませんでした。</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">ストーリー編集</h1>
            </div>
            
            <div className="flex items-center">
              {saveSuccess && (
                <span className="text-green-600 mr-4 flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存しました
                </span>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <StoryEditor 
            story={storyData} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </main>
    </div>
  );
}
