'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type PointsDisplayProps = {
  className?: string;
};

export default function PointsDisplay({ className = '' }: PointsDisplayProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  // const [storiesCount, setStoriesCount] = useState(0);

  useEffect(() => {
    if (status === 'loading' || !session) return;
    
    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // ストーリー数を取得する処理を追加する場合はここに実装
      // 現在は親コンポーネントから取得する想定
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">ストーリー作成</h3>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-700">
              アイデアやテーマから、あなただけのオリジナルストーリーを作成できます。
            </p>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-[var(--primary)] mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>簡単な質問に答えるだけで物語を生成</span>
            </div>
            <div className="flex items-center mt-1">
              <svg className="h-4 w-4 text-[var(--primary)] mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>自由に編集してカスタマイズ可能</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
