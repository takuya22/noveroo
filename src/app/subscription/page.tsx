'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PrimaryButton } from '@/ui/buttons/PrimaryButton';
import { SecondaryButton } from '@/ui/buttons/SecondaryButton';
// import { PREMIUM_POINTS_PER_MONTH, POINTS_PER_STORY } from '@/lib/stripe';

const PREMIUM_POINTS_PER_MONTH = 2000; // プレミアムプランの月間ポイント数
const POINTS_PER_STORY = 100; // 1ストーリー生成あたりの消費ポイント数

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    isPremium: false,
    subscriptionStatus: 'none',
    totalPoints: 0,
    lastPointsAddedAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  });

  // URLパラメータを確認
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/subscription');
      return;
    }
    
    // サブスクリプション状態を取得
    fetchSubscriptionStatus();
  }, [session, status, router]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/stripe/subscription-status');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/subscription`,
        }),
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/subscription`,
        }),
      });

      const data = await response.json();
      
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    } finally {
      setLoading(false);
    }
  };

  // 最終ポイント追加日をフォーマット
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'なし';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[var(--primary)] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">チケット制度のご案内</h1>
          <p className="text-lg text-gray-600">AIを活用したストーリー作成をより快適に</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 mb-12 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">チケット制度について</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-3">毎日リフレッシュされるチケット</h3>
              <p className="text-gray-700 mb-4">
                ストーリー生成には「チケット」が必要です。チケットは毎日午前0時に自動的に5枚補充されます。
              </p>
              <div className="flex items-center text-blue-700">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">1日に最大5つのストーリーを生成できます</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">チケットの使い方</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>ストーリー生成時に1枚のチケットが自動的に使用されます</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>チケット残数はダッシュボードで確認できます</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>生成したストーリーは何度でもプレイ可能です</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">ポイント制度との併用</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>既存のポイント制度も継続してご利用いただけます</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>初回登録時に付与されたポイントは引き続きご利用いただけます</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>1ストーリーの生成には、チケット1枚または{POINTS_PER_STORY}ポイントが必要です</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <PrimaryButton
              onClick={() => router.push('/dashboard')}
              className="w-full max-w-xs mx-auto py-3"
            >
              ダッシュボードに戻る
            </PrimaryButton>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">チケットはいつリセットされますか？</h3>
              <p className="text-gray-600">チケットは毎日午前0時（日本時間）に5枚に自動的にリセットされます。使い切れなかったチケットは翌日にリセットされますのでご注意ください。</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">チケットとポイントの違いは何ですか？</h3>
              <p className="text-gray-600">チケットは毎日自動的にリセットされる消費リソースで、ポイントは永続的に使えるリソースです。どちらもストーリー生成に使用できますが、チケットが優先的に消費されます。</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">チケットがなくなった場合はどうなりますか？</h3>
              <p className="text-gray-600">チケットがなくなった場合は、翌日の午前0時までお待ちいただくか、既存のポイントを使用してストーリーを生成することができます。</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">生成したストーリーは保存されますか？</h3>
              <p className="text-gray-600">はい、生成したストーリーはアカウントに保存され、チケットやポイントを消費せずに何度でもプレイすることができます。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
