"use client";

import { useState, useEffect, useRef } from 'react';
import { Story, Scene, Choice } from '@/utils/storyModel';
import { PrimaryButton } from '@/ui/buttons/PrimaryButton';
import { SecondaryButton } from '@/ui/buttons/SecondaryButton';

interface StoryPlayerProps {
  story: Story;
  onClose?: () => void;
  standalone?: boolean; // スタンドアロンモードかどうか
  onComplete?: (results: any) => void; // 完了時のコールバック
  language?: 'ja' | 'en'; // 言語設定
}

export default function StoryPlayer({ 
  story, 
  onClose, 
  standalone = true,
  onComplete,
  language = 'ja'
}: StoryPlayerProps) {
  // 現在のシーンを管理
  const [currentSceneId, setCurrentSceneId] = useState<string>(story.initialScene);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  
  // テキスト表示アニメーションの状態
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [textComplete, setTextComplete] = useState<boolean>(false);
  
  // 選択肢の表示状態
  const [showChoices, setShowChoices] = useState<boolean>(false);
  
  // アニメーション速度（ミリ秒/文字）
  const [typingSpeed, setTypingSpeed] = useState<number>(30);
  
  // 学習ポイントの表示状態
  const [showLearningPoint, setShowLearningPoint] = useState<boolean>(false);
  
  // 履歴管理
  const [history, setHistory] = useState<Array<{sceneId: string, choice?: string}>>([]);
  
  // プレイデータ（進捗や選択を記録）
  const [playData, setPlayData] = useState<{
    startTime: number;
    endTime?: number;
    choices: Array<{sceneId: string, choiceText: string, timestamp: number}>;
    completedScenes: string[];
  }>({
    startTime: Date.now(),
    choices: [],
    completedScenes: []
  });
  
  // 自動モード
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const autoModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // シーンマップの作成（検索を効率化）
  const scenesMap = useRef<Record<string, Scene>>({});
  
  useEffect(() => {
    // シーンマップを構築
    const map: Record<string, Scene> = {};
    story.scenes.forEach(scene => {
      map[scene.id] = scene;
    });
    scenesMap.current = map;
    
    // 初期シーンをセット
    setActiveScene(map[story.initialScene]);
    setHistory([{ sceneId: story.initialScene }]);
    
    // プレイデータ初期化
    setPlayData({
      startTime: Date.now(),
      choices: [],
      completedScenes: [story.initialScene]
    });
    
    // クリーンアップ
    return () => {
      if (autoModeTimeoutRef.current) {
        clearTimeout(autoModeTimeoutRef.current);
      }
    };
  }, [story]);
  
  // シーンが変わったときの処理
  useEffect(() => {
    if (!currentSceneId || !scenesMap.current[currentSceneId]) return;
    
    const scene = scenesMap.current[currentSceneId];
    setActiveScene(scene);
    setTextComplete(false);
    setShowChoices(false);
    setDisplayedText('');
    setIsTyping(true);
    
    // テキストアニメーション開始
    let timeout: NodeJS.Timeout;
    const startTextAnimation = () => {
      const fullText = language === 'ja' ? scene.text : (scene.text_en || scene.text);
      let i = 0;
      
      const typeText = () => {
        if (i < fullText.length) {
          setDisplayedText(fullText.substring(0, i + 1));
          i++;
          timeout = setTimeout(typeText, typingSpeed);
        } else {
          setIsTyping(false);
          setTextComplete(true);
          setShowChoices(true);
          
          // 自動モードの場合、選択肢がなければ自動的に次へ
          if (autoMode && (!scene.choices || scene.choices.length === 0)) {
            autoModeTimeoutRef.current = setTimeout(() => {
              handleContinue();
            }, 2000);
          }
        }
      };
      
      typeText();
    };
    
    startTextAnimation();
    
    // クリーンアップ
    return () => {
      clearTimeout(timeout);
    };
  }, [currentSceneId, language, autoMode, typingSpeed]);
  
  // テキストを一気に表示する
  const skipTextAnimation = () => {
    if (!activeScene) return;
    
    const fullText = language === 'ja' ? activeScene.text : (activeScene.text_en || activeScene.text);
    setDisplayedText(fullText);
    setIsTyping(false);
    setTextComplete(true);
    setShowChoices(true);
  };
  
  // 選択肢をクリックしたときの処理
  const handleChoiceClick = (choice: Choice) => {
    if (!activeScene) return;
    
    // 選択を記録
    setPlayData(prev => ({
      ...prev,
      choices: [
        ...prev.choices, 
        {
          sceneId: activeScene.id,
          choiceText: choice.text,
          timestamp: Date.now()
        }
      ],
      completedScenes: [...prev.completedScenes, choice.nextScene]
    }));
    
    // 履歴に追加
    setHistory(prev => [...prev, { sceneId: choice.nextScene, choice: choice.text }]);
    
    // 次のシーンへ
    setCurrentSceneId(choice.nextScene);
  };
  
  // 選択肢がないシーンで続けるときの処理
  const handleContinue = () => {
    if (!activeScene || !activeScene.choices || activeScene.choices.length === 0) {
      // ストーリー終了処理
      setPlayData(prev => ({
        ...prev,
        endTime: Date.now()
      }));
      
      if (onComplete) {
        onComplete(playData);
      }
      
      if (onClose) {
        onClose();
      }
      return;
    }
    
    // 選択肢が1つだけで、自動的に次へ進む場合
    if (activeScene.choices.length === 1) {
      handleChoiceClick(activeScene.choices[0]);
    }
  };
  
  // 自動モードの切り替え
  const toggleAutoMode = () => {
    setAutoMode(prev => !prev);
  };
  
  // テキスト表示速度の変更
  const changeTypingSpeed = (speed: number) => {
    setTypingSpeed(speed);
  };
  
  // 学習ポイントの表示切り替え
  const toggleLearningPoint = () => {
    setShowLearningPoint(prev => !prev);
  };
  
  // シーンのテキストか選択肢をクリックしたときの処理
  const handleScreenClick = () => {
    if (isTyping) {
      // テキストアニメーション中なら、アニメーションをスキップ
      skipTextAnimation();
    } else if (textComplete && (!activeScene?.choices || activeScene.choices.length === 0)) {
      // 選択肢がなければ、次へ進む
      handleContinue();
    }
  };
  
  // 背景スタイルの設定
  const getBackgroundStyle = () => {
    if (!activeScene) return {};
    
    // 生成された画像がある場合はそれを使用
    if (activeScene.sceneImageUrl) {
      return {
        backgroundImage: `url(${activeScene.sceneImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // デフォルトのグラデーション背景
    return {
      background: 'linear-gradient(135deg, rgba(176, 224, 255, 0.8) 0%, rgba(218, 249, 255, 0.9) 100%)'
    };
  };
  
  if (!activeScene) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[var(--primary)] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative ${standalone ? 'min-h-screen' : 'min-h-[600px]'} bg-black`}>
      {/* 閉じるボタン */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* ゲームタイトル */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-white text-shadow font-bold text-lg bg-gray-800 bg-opacity-50 px-3 py-1 rounded-lg">
          {story.title}
        </h1>
      </div>
      
      {/* 自動モードと設定ボタン */}
      <div className="absolute top-4 right-16 z-10 flex space-x-2">
        <button 
          onClick={toggleAutoMode}
          className={`bg-gray-800 bg-opacity-50 text-white px-3 py-1 rounded-lg hover:bg-opacity-70 transition-colors ${autoMode ? 'bg-[var(--primary)] bg-opacity-70' : ''}`}
        >
          自動
        </button>
        <button 
          onClick={() => changeTypingSpeed(typingSpeed === 30 ? 10 : 30)}
          className="bg-gray-800 bg-opacity-50 text-white px-3 py-1 rounded-lg hover:bg-opacity-70 transition-colors"
        >
          {typingSpeed === 30 ? '速く' : '通常'}
        </button>
      </div>
      
      {/* 背景エリア */}
      <div 
        className="relative w-full h-full min-h-screen flex flex-col"
        style={getBackgroundStyle()}
      >
        {/* 学習ポイントが表示されている場合のオーバーレイ */}
        {showLearningPoint && activeScene.learningPoint && (
          <div className="absolute inset-0 bg-black bg-opacity-80 z-20 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[var(--primary)]">学習ポイント</h3>
                <button 
                  onClick={toggleLearningPoint}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h4 className="text-lg font-semibold mb-2">{activeScene.learningPoint.title}</h4>
              <p className="text-gray-700">{activeScene.learningPoint.content}</p>
              <div className="mt-6 text-right">
                <button 
                  onClick={toggleLearningPoint}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* テキストとUI表示エリア */}
        <div className="mt-auto">
          {/* キャラクターが表示されるエリア（今後実装） */}
          <div className="min-h-[300px]"></div>
          
          {/* テキストボックス */}
          <div 
            className="relative bg-white bg-opacity-90 border-t border-gray-200 p-6 min-h-[200px] cursor-pointer"
            onClick={handleScreenClick}
          >
            {/* 学習ポイントボタン */}
            {activeScene.learningPoint && (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleLearningPoint(); }}
                className="absolute top-4 right-4 bg-[var(--primary)] text-white px-3 py-1 text-sm rounded-full hover:bg-[var(--primary-dark)] transition-colors"
              >
                学習ポイント
              </button>
            )}
            
            {/* 話者名（キャラクター名） */}
            {activeScene.characters && activeScene.characters.length > 0 && (
              <div className="inline-block bg-[var(--primary)] text-white px-3 py-1 rounded-tl-md rounded-tr-md rounded-br-md mb-2">
                {activeScene.characters[0].id}
              </div>
            )}
            
            {/* テキスト */}
            <div className="text-lg leading-relaxed">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
            
            {/* スキップ・続けるボタン */}
            {isTyping ? (
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); skipTextAnimation(); }}
                  className="text-[var(--primary)] hover:text-[var(--primary-dark)] text-sm underline"
                >
                  スキップ
                </button>
              </div>
            ) : textComplete && (!activeScene.choices || activeScene.choices.length === 0) && (
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 text-sm animate-pulse">クリックで続ける</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* 選択肢 */}
          {showChoices && activeScene.choices && activeScene.choices.length > 0 && (
            <div className="bg-gray-100 p-6 space-y-3">
              {activeScene.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceClick(choice)}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-[var(--primary-light)] hover:border-[var(--primary)] transition-colors"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
