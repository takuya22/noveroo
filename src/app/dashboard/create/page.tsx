"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';

// 作成方法の選択タブ
const creationMethods = [
  { id: 'theme', label: 'テーマから作成' },
  { id: 'article', label: '記事から作成' },
  { id: 'custom', label: 'フリー入力で作成' },
];

export default function CreateStory() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [activeMethod, setActiveMethod] = useState('theme');
  const [inputText, setInputText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // 認証されていないユーザーをホームページにリダイレクト
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // 作成方法に基づいたプレースホルダーテキスト
  const getPlaceholderText = () => {
    switch (activeMethod) {
      case 'theme':
        return 'ファンタジー、SF、ミステリー、歴史、学習など、作りたいストーリーのテーマを入力してください...';
      case 'article':
        return '記事やテキストを貼り付けてください。このテキストを元にストーリーを生成します...';
      case 'custom':
        return '自由にプロンプトを入力してください。例：「魔法学校を舞台にした、友情と成長を描く対話式の冒険ストーリー」...';
      default:
        return '';
    }
  };

  // ストーリー作成処理
  const handleCreateStory = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('テキストを入力してください');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      // APIを呼び出してストーリーを生成
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputType: activeMethod,
          inputText: inputText,
          options: {
            difficulty: 'normal',
            length: 'medium'
          },
          generateImages: true // 画像も生成する
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ストーリー生成に失敗しました');
      }
      
      const data = await response.json();
      
      // 成功したら詳細ページへ（現在はダッシュボードに戻る）
      router.push('/dashboard');
    } catch (err) {
      console.error('Story creation error:', err);
      setError('ストーリーの作成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsCreating(false);
    }
  };

  // ローディング中の表示
  if (loading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">ストーリーを作成</h1>
          </div>
          
          {/* 作成方法の選択タブ */}
          <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
            <div className="flex border-b border-gray-200">
              {creationMethods.map((method) => (
                <button
                  key={method.id}
                  className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
                    activeMethod === method.id
                      ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveMethod(method.id)}
                >
                  {method.label}
                </button>
              ))}
            </div>
            
            {/* 入力フォーム */}
            <form onSubmit={handleCreateStory} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeMethod === 'theme' ? 'テーマ' : 
                   activeMethod === 'article' ? '記事・テキスト' : 
                   'プロンプト'}
                </label>
                <textarea
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  placeholder={getPlaceholderText()}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  required
                ></textarea>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
              
              {/* ヒントとガイダンス */}
              <div className="bg-[var(--primary-light)] rounded-md p-4 mb-6">
                <h3 className="font-medium text-[var(--primary)] mb-2">ヒント</h3>
                <p className="text-sm text-gray-700">
                  {activeMethod === 'theme' ? 
                    '具体的なテーマを入力すると、より良いストーリーが生成されます。例：「宇宙探検」「中世ファンタジー」「クリスマスミステリー」' : 
                   activeMethod === 'article' ? 
                    '記事やテキストを入力すると、その内容に基づいたストーリーが生成されます。長さは500〜2000文字程度が最適です。' : 
                    '登場人物、設定、ジャンル、対象年齢層など、具体的な指示を入れるとよりイメージに近いストーリーになります。'}
                </p>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors disabled:bg-gray-400"
                >
                  {isCreating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      作成中...
                    </span>
                  ) : (
                    'ストーリーを作成'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* 作成方法の説明 */}
          <div className="bg-gray-100 rounded-b-lg border border-gray-200 border-t-0 p-6">
            <h3 className="font-medium text-gray-800 mb-3">
              {activeMethod === 'theme' ? 'テーマから作成とは？' : 
               activeMethod === 'article' ? '記事から作成とは？' : 
               'フリー入力で作成とは？'}
            </h3>
            <p className="text-sm text-gray-600">
              {activeMethod === 'theme' ? 
                'テーマから作成では、簡単なキーワードやテーマを入力するだけで、AIがインタラクティブなストーリーを自動生成します。教育目的や特定のテーマに沿ったストーリーを手軽に作りたい方におすすめです。' : 
               activeMethod === 'article' ? 
                '記事から作成では、既存の記事やテキストを入力すると、その内容に基づいたストーリーを生成します。学習教材や特定の知識を教えるためのストーリーを作成したい場合に最適です。' : 
                'フリー入力では、AIに対する詳細な指示を自由に入力できます。ストーリーの構造、キャラクター、世界観など、細かい要素を指定したい上級者向けの作成方法です。'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
