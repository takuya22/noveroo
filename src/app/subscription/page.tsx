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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">サブスクリプションプラン</h1>
          <p className="text-lg text-gray-600">AIを活用したストーリー作成をより快適に</p>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="font-medium">サブスクリプションが正常に開始されました！毎月{PREMIUM_POINTS_PER_MONTH.toLocaleString()}ポイントが付与されます。</p>
          </div>
        )}

        {canceled && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">サブスクリプションの処理はキャンセルされました。</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 無料プラン */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-gray-200 transition-colors">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">無料プラン</h2>
              <div className="mb-4">
                <span className="text-3xl font-bold">¥0</span>
                <span className="text-gray-500">/月</span>
              </div>
              <p className="text-gray-600 mb-6">初回登録時に5ポイント付与</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>1ストーリー = {POINTS_PER_STORY}ポイント</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>基本機能が利用可能</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>毎月のポイント付与なし</span>
                </li>
              </ul>
              <div>
                <SecondaryButton
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3"
                >
                  無料で利用する
                </SecondaryButton>
              </div>
            </div>
          </div>

          {/* プレミアムプラン */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[var(--primary)] hover:border-[var(--primary-dark)] transition-colors relative">
            <div className="absolute top-0 right-0 bg-[var(--primary)] text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
              おすすめ
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">プレミアムプラン</h2>
              <div className="mb-4">
                <span className="text-3xl font-bold">¥980</span>
                <span className="text-gray-500">/月</span>
              </div>
              <p className="text-gray-600 mb-6">毎月{PREMIUM_POINTS_PER_MONTH.toLocaleString()}ポイント付与（{Math.floor(PREMIUM_POINTS_PER_MONTH / POINTS_PER_STORY)}ストーリー分）</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>1ストーリー = {POINTS_PER_STORY}ポイント</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>すべての機能が利用可能</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>毎月自動でポイント付与</span>
                </li>
              </ul>
              <div>
                {subscriptionData.isPremium ? (
                  <PrimaryButton
                    onClick={handleManageSubscription}
                    loading={loading}
                    className="w-full py-3"
                  >
                    サブスクリプションを管理
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    onClick={handleSubscribe}
                    loading={loading}
                    className="w-full py-3"
                  >
                    今すぐ登録する
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あなたのアカウント情報</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">現在のプラン</p>
                <p className="font-medium">
                  {subscriptionData.isPremium ? 'プレミアム' : '無料'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">サブスクリプション状態</p>
                <p className="font-medium">
                  {
                    subscriptionData.subscriptionStatus === 'active' ? '有効' :
                    subscriptionData.subscriptionStatus === 'trialing' ? 'トライアル中' :
                    subscriptionData.subscriptionStatus === 'canceled' ? 'キャンセル済み' :
                    subscriptionData.subscriptionStatus === 'inactive' ? '無効' :
                    'なし'
                  }
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">現在のポイント残高</p>
                <p className="font-medium">
                  <span className="text-xl font-bold text-[var(--primary)]">{subscriptionData.totalPoints}</span> ポイント
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">最終ポイント付与日</p>
                <p className="font-medium">
                  {formatDate(subscriptionData.lastPointsAddedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">サブスクリプションはいつでもキャンセルできますか？</h3>
              <p className="text-gray-600">はい、いつでもキャンセル可能です。キャンセル後も契約期間終了までは引き続きサービスをご利用いただけます。</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">ポイントは次の月に繰り越されますか？</h3>
              <p className="text-gray-600">はい、未使用のポイントは自動的に次の月に繰り越されます。</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">ポイントが足りなくなった場合はどうすればいいですか？</h3>
              <p className="text-gray-600">現在はプレミアムプランを契約いただくと毎月新たなポイントが付与されます。将来的には追加ポイントの購入オプションも検討しています。</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">支払い方法を変更するにはどうすればいいですか？</h3>
              <p className="text-gray-600">「サブスクリプションを管理」ボタンから、Stripeのカスタマーポータルにアクセスし、支払い方法を変更できます。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
