'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const POINTS_PER_STORY = 100; // 1ストーリー生成あたりの消費ポイント数

type PointsDisplayProps = {
  className?: string;
};

export default function PointsDisplay({ className = '' }: PointsDisplayProps) {
  const { data: session, status } = useSession();
  const [pointsData, setPointsData] = useState({
    totalPoints: 0,
    isPremium: false,
    subscriptionStatus: 'none',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading' || !session) return;
    
    fetchPointsData();
  }, [session, status]);

  const fetchPointsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/subscription-status');
      if (response.ok) {
        const data = await response.json();
        setPointsData(data);
      }
    } catch (error) {
      console.error('Error fetching points data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPointsStatus = () => {
    const storiesRemaining = Math.floor(pointsData.totalPoints / POINTS_PER_STORY);
    
    if (loading) {
      return <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>;
    }
    
    if (storiesRemaining <= 1) {
      return (
        <div className="text-red-600 font-medium">
          残り{storiesRemaining}ストーリー分
        </div>
      );
    } else if (storiesRemaining <= 3) {
      return (
        <div className="text-yellow-600 font-medium">
          残り{storiesRemaining}ストーリー分
        </div>
      );
    } else {
      return (
        <div className="text-green-600 font-medium">
          残り{storiesRemaining}ストーリー分
        </div>
      );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">ポイント残高</h3>
        <Link
          href="/subscription"
          className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
        >
          詳細 / チャージ
        </Link>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-[var(--primary)]">{pointsData.totalPoints}</span>
            <span className="ml-1 text-gray-600">ポイント</span>
          </div>
          
          <div className="mt-1 flex justify-between items-center">
            {renderPointsStatus()}
            
            {!pointsData.isPremium && pointsData.totalPoints < POINTS_PER_STORY * 2 && (
              <Link
                href="/subscription"
                className="text-sm px-3 py-1 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
              >
                チャージする
              </Link>
            )}
          </div>
        </>
      )}
      
      {!loading && pointsData.isPremium && (
        <div className="mt-3 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-[var(--primary)] mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>プレミアムプラン: 毎月自動チャージ</span>
          </div>
        </div>
      )}
    </div>
  );
}
