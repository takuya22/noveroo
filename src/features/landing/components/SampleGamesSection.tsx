"use client";

import React, { useState } from 'react';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';
import { PlayIcon } from '../../../ui/icons/Play';
import Link from 'next/link';

// シミュレーションゲームのサンプルデータ
const sampleGames = [
  {
    id: 'science-voyage',
    title: '宇宙探査シミュレーション',
    category: '科学',
    description: '宇宙船の船長として未知の惑星を探査する冒険。様々な科学的知識を活用して困難を乗り越えよう。',
    tags: ['科学', '宇宙', '探検'],
    imageUrl: '/sample-games/space-exploration.jpg',
    backgroundColor: 'bg-blue-50',
    accentColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    id: 'edo-adventure',
    title: '江戸時代の冒険',
    category: '歴史',
    description: '江戸時代にタイムスリップした主人公となって歴史を体験。当時の生活習慣や文化を学びながら冒険しよう。',
    tags: ['歴史', '日本', '江戸時代'],
    imageUrl: '/sample-games/edo-period.jpg',
    backgroundColor: 'bg-amber-50',
    accentColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  {
    id: 'business-tycoon',
    title: 'ビジネス戦略ゲーム',
    category: 'ビジネス',
    description: '起業家として会社を設立し、様々な経営判断を下していくシミュレーション。ビジネスの基本を楽しく学べる。',
    tags: ['経営', 'ビジネス', '起業'],
    imageUrl: '/sample-games/business-strategy.jpg',
    backgroundColor: 'bg-emerald-50',
    accentColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'language-quest',
    title: '英語で世界一周',
    category: '言語',
    description: '世界各国を旅しながら英語でコミュニケーションを取るアドベンチャー。実践的な英語を楽しみながら身につけよう。',
    tags: ['英語', '旅行', '学習'],
    imageUrl: '/sample-games/world-travel.jpg',
    backgroundColor: 'bg-purple-50',
    accentColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  }
];

export const SampleGamesSection = () => {
  // アクティブなゲームを管理するstate
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div id="sample-games" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--primary)]">サンプルゲーム</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            様々なジャンルのシミュレーションが作れます
          </p>
          <p className="mt-6 text-lg leading-7 text-gray-600">
            Noverooで作成できるゲームのサンプルをご紹介します。これらはAIによって自動生成されたもので、あなたのアイデアから同様のゲームを簡単に作成できます。
          </p>
        </div>

        {/* ゲームカードのグリッド */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {sampleGames.map((game) => (
            <div 
              key={game.id}
              className={`flex flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${game.backgroundColor} border ${game.borderColor}`}
            >
              {/* サムネイル画像部分（実際のプロジェクトでは画像を用意） */}
              <div className={`h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative`}>
                {/* 画像がない場合のプレースホルダー */}
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">{game.title}</div>
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black bg-opacity-50 text-white text-xs">
                  {game.category}
                </div>
              </div>

              {/* ゲーム詳細 */}
              <div className="flex flex-col flex-grow p-6">
                <h3 className={`text-lg font-semibold mb-2 ${game.accentColor}`}>{game.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{game.description}</p>
                
                {/* タグ */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {game.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* プレイボタン */}
                <button 
                  className={`flex items-center justify-center w-full rounded-md py-2 px-4 ${game.accentColor.replace('text-', 'bg-').replace('-600', '-500')} bg-opacity-90 hover:bg-opacity-100 text-white font-medium transition-colors`}
                  onClick={() => setActiveGame(game.id)}
                >
                  <PlayIcon size={16} className="mr-2" />
                  プレイする
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 「自分だけのゲームを作る」CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-gray-600 mb-6">
            お気に入りのシナリオが見つからない？<br className="sm:hidden" />あなただけのオリジナルゲームを作りましょう！
          </p>

          <Link href="/dashboard/create">
            <PrimaryButton 
              className="rounded-md px-8 py-3 text-base font-medium shadow"
            >
              自分のゲームを作る
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* ゲームプレビューモーダル（実装する場合） */}
      {activeGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">
                {sampleGames.find(g => g.id === activeGame)?.title}
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setActiveGame(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-600 italic">
                ここにゲームプレビューが表示されます...
              </p>
              {/* 実際のプレビュー内容 */}
              <div className="h-96 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                <p className="text-gray-500">ゲームプレビュー</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50">
              <button 
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setActiveGame(null)}
              >
                閉じる
              </button>
              <PrimaryButton>
                このゲームを編集
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
