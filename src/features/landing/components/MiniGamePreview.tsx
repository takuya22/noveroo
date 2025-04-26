import React, { useState } from 'react';
import { PlayIcon } from '../../../ui/icons/Play';

// シンプルなノベルゲームシミュレーション
export const MiniGamePreview = () => {
  // 現在のステップを管理するstate
  const [currentStep, setCurrentStep] = useState(0);
  
  // 簡易的なゲームシナリオデータ
  const gameSteps = [
    {
      text: "いつもと変わらない朝。学校に向かう途中、空から強い光が降り注いだ。気がつくと、そこは見知らぬ惑星だった...",
      choices: [
        { text: "周囲を調査する", nextStep: 1 },
        { text: "助けを呼ぶ", nextStep: 2 }
      ],
      background: "bg-gradient-to-b from-indigo-500 to-purple-600"
    },
    {
      text: "あたりを見回すと、奇妙な植物が生い茂っている。葉の形が地球とは明らかに違う。近くには小さな水たまりもある。",
      choices: [
        { text: "植物を調べる", nextStep: 3 },
        { text: "水たまりに近づく", nextStep: 4 }
      ],
      background: "bg-gradient-to-b from-green-500 to-teal-600"
    },
    {
      text: "「誰か助けて！」と叫ぶと、遠くから不思議な音が聞こえてきた。音の方向を見ると、光る物体が近づいてくる...",
      choices: [
        { text: "隠れる", nextStep: 5 },
        { text: "手を振る", nextStep: 6 }
      ],
      background: "bg-gradient-to-b from-amber-500 to-orange-600"
    },
    {
      text: "植物をよく観察すると、葉に小さな発光体があることに気づいた。これは地球の植物とは全く異なる特性だ！",
      choices: [
        { text: "サンプルを採取する", nextStep: 7 },
        { text: "他の場所も探索する", nextStep: 8 }
      ],
      background: "bg-gradient-to-b from-emerald-500 to-green-600"
    },
    {
      text: "水たまりに近づくと、水面に奇妙な模様が浮かび上がった。よく見ると、それはこの惑星の地図のようだ！",
      choices: [
        { text: "地図を記録する", nextStep: 9 },
        { text: "水に触れてみる", nextStep: 10 }
      ],
      background: "bg-gradient-to-b from-blue-500 to-cyan-600"
    },
    {
      text: "大きな岩の陰に隠れた。光る物体はゆっくりと近づき、その正体が見えてきた。それは...",
      choices: [
        { text: "もっと見る", nextStep: 0, reset: true },
        { text: "別の選択肢を試す", nextStep: 0, reset: true }
      ],
      background: "bg-gradient-to-b from-gray-700 to-gray-900"
    },
    {
      text: "光る物体に向かって手を振ると、物体が明るく光を放ち、あなたの方へ急速に近づいてきた！",
      choices: [
        { text: "逃げる", nextStep: 0, reset: true },
        { text: "その場にとどまる", nextStep: 0, reset: true }
      ],
      background: "bg-gradient-to-b from-red-500 to-pink-600"
    },
    {
      text: "葉のサンプルを採取すると、手のひらで淡く光り始めた。この植物には何か特別な能力があるのかもしれない...",
      choices: [
        { text: "もっと見る", nextStep: 0, reset: true },
        { text: "別の選択肢を試す", nextStep: 0, reset: true }
      ],
      background: "bg-gradient-to-b from-lime-500 to-green-600"
    },
    {
      text: "別の場所を探索すると、遠くに人工的な構造物らしきものが見えた。この惑星に知的生命体がいるのだろうか？",
      choices: [
        { text: "もっと見る", nextStep: 0, reset: true },
        { text: "別の選択肢を試す", nextStep: 0, reset: true }
      ],
      background: "bg-gradient-to-b from-violet-500 to-indigo-600"
    },
    {
      text: "地図を注意深く記録した。これでこの奇妙な惑星を効率的に探索できるはずだ。冒険の序章が始まる...",
      choices: [
        { text: "もっと見る", nextStep: 0, reset: true },
        { text: "別の選択肢を試す", nextStep: 0, reset: true }
      ],
      background: "bg-gradient-to-b from-sky-500 to-blue-600"
    },
    {
      text: "水に触れると、指先がわずかに青く光り始めた。体に何が起きているのか？この惑星の水には不思議な力があるようだ...",
      choices: [
        { text: "もっと見る", nextStep: 0, reset: true },
        { text: "別の選択肢を試す", nextStep: 0, reset: true }
      ],
      background: "bg-gradient-to-b from-cyan-500 to-blue-600"
    }
  ];

  // 現在のステップ情報
  const currentStepData = gameSteps[currentStep];

  // 選択肢をクリックした時の処理
  const handleChoiceClick = (nextStep, reset = false) => {
    if (reset) {
      // ゲームをリセット
      setTimeout(() => {
        setCurrentStep(nextStep);
      }, 300);
    } else {
      // 次のステップへ
      setCurrentStep(nextStep);
    }
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white flex flex-col">
      {/* ブラウザっぽいヘッダー */}
      <div className="h-12 bg-[var(--gray-50)] border-b border-gray-200 flex items-center px-4">
        <div className="w-3 h-3 rounded-full bg-[var(--gray-300)] mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-[var(--gray-300)] mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-[var(--gray-300)]"></div>
        <div className="ml-4 px-3 py-1 bg-white rounded text-xs text-[var(--gray-600)] border border-[var(--gray-200)]">
          <span className="hidden sm:inline">異星人との遭遇 - </span>シミュレーションゲーム
        </div>
        <div className="ml-auto flex items-center">
          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-medium">
            <PlayIcon size={12} />
          </div>
          <span className="ml-1 text-xs text-gray-400">実行中</span>
        </div>
      </div>

      {/* ゲーム画面 */}
      <div className="flex flex-col flex-grow">
        {/* 背景エリア（グラデーション背景） */}
        <div className={`flex-grow relative ${currentStepData.background} transition-all duration-500`}>
          {/* 背景画像の代わりのグラデーション */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black"></div>
          </div>

          {/* ゲームコンテンツ */}
          <div className="relative h-full flex flex-col justify-end p-6">
            {/* テキストボックス */}
            <div 
              className="bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg mb-4 transition-opacity duration-300"
            >
              <p className="text-sm sm:text-base">{currentStepData.text}</p>
            </div>
            
            {/* 選択肢 */}
            <div className="flex flex-col gap-2 transition-opacity duration-300">
              {currentStepData.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-[var(--primary-dark)] py-2 px-4 rounded-lg text-sm text-left transition-colors"
                  onClick={() => handleChoiceClick(choice.nextStep, choice.reset)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
