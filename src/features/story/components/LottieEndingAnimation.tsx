"use client";

import { useState } from 'react';
import Lottie from 'lottie-react';
import { EndingType } from '@/utils/storyModel';

// ロッティーアニメーションのJSONファイル
// Note: 実際のLottieファイルは後で追加する必要があります
import happyEndingAnimation from '../../../../public/animations/happy-ending.json';
import badEndingAnimation from '../../../../public/animations/bad-ending.json';
import trueEndingAnimation from '../../../../public/animations/true-ending.json';
import mysteryEndingAnimation from '../../../../public/animations/mystery-ending.json';
import normalEndingAnimation from '../../../../public/animations/normal-ending.json';
import instantDeathEndingAnimation from '../../../../public/animations/instant-death-ending.json';

interface LottieEndingAnimationProps {
  endingType: EndingType;
  onComplete: () => void;
  visible: boolean;
}

// エンディングタイプに基づいたアニメーションファイルとスタイルを取得
const getAnimationAndStyle = (endingType: EndingType) => {
  switch (endingType) {
    case 'happy':
      return {
        animation: happyEndingAnimation, // ここは実際のアニメーションファイルに置き換える必要があります
        backgroundColor: 'linear-gradient(135deg, rgba(0, 200, 255, 0.8), rgba(0, 255, 200, 0.8))',
        textColor: 'text-white',
        title: 'ハッピーエンド',
        description: 'おめでとう！あなたは素晴らしい結末を迎えました'
      };
    case 'bad':
      return {
        animation: badEndingAnimation,
        backgroundColor: 'linear-gradient(135deg, rgba(100, 0, 0, 0.8), rgba(50, 0, 0, 0.8))',
        textColor: 'text-white',
        title: 'バッドエンド',
        description: '残念ながら、物語は悲しい結末を迎えました'
      };
    case 'true':
      return {
        animation: trueEndingAnimation,
        backgroundColor: 'linear-gradient(135deg, rgba(128, 0, 128, 0.8), rgba(75, 0, 130, 0.8))',
        textColor: 'text-white',
        title: 'トゥルーエンド',
        description: '真実の結末を見つけました'
      };
    case 'mystery':
      return {
        animation: mysteryEndingAnimation,
        backgroundColor: 'linear-gradient(135deg, rgba(0, 0, 50, 0.8), rgba(30, 30, 70, 0.8))',
        textColor: 'text-white',
        title: 'ミステリーエンド',
        description: '物語には、まだ解き明かされていない謎があります...'
      };
    case 'normal':
      return {
        animation: normalEndingAnimation,
        backgroundColor: 'linear-gradient(135deg, rgba(100, 100, 100, 0.8), rgba(50, 50, 50, 0.8))',
        textColor: 'text-white',
        title: 'ノーマルエンド',
        description: '物語は幕を閉じました'
      };
    case 'instant-death':
      return {
        animation: instantDeathEndingAnimation,
        backgroundColor: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(100, 0, 0, 0.9))',
        textColor: 'text-white',
        title: '即死エンド',
        description: 'あなたの冒険は突然終わりました'
      };
    default:
      return {
        animation: normalEndingAnimation,
        backgroundColor: 'linear-gradient(135deg, rgba(50, 50, 50, 0.8), rgba(20, 20, 20, 0.8))',
        textColor: 'text-white',
        title: 'エンディング',
        description: '物語は終わりました'
      };
  }
};

const LottieEndingAnimation = ({ endingType, onComplete, visible }: LottieEndingAnimationProps) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const { animation, backgroundColor, textColor, title, description } = getAnimationAndStyle(endingType);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: backgroundColor }}
    >
      {/* 上部テキスト */}
      <div className={`text-center mb-8 ${textColor} transition-transform duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <p className="text-xl">{description}</p>
      </div>
      
      {/* Lottieアニメーション */}
      <div className="w-full max-w-md h-64 relative">
        <Lottie 
          animationData={animation} 
          loop={false}
          onComplete={() => {
            setAnimationComplete(true);
            setTimeout(onComplete, 10000);
          }}
          className="w-full h-full"
        />
      </div>
      
      {/* 下部のコントロール */}
      <div className={`mt-8 transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={onComplete}
          className="px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black rounded-full border border-white border-opacity-30 transition-all duration-300"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default LottieEndingAnimation;