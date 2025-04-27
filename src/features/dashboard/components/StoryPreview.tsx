"use client";

import { useState, useEffect } from 'react';
import { Story, Scene, Choice } from '@/utils/storyModel';
import Image from 'next/image';

interface StoryPreviewProps {
  story: Story;
  onClose: () => void;
}

export default function StoryPreview({ story, onClose }: StoryPreviewProps) {
  const [currentSceneId, setCurrentSceneId] = useState<string>(story.initialScene);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showLearningPoint, setShowLearningPoint] = useState<boolean>(false);
  const [textAnimated, setTextAnimated] = useState<boolean>(false);

  // 現在のシーンを取得
  useEffect(() => {
    const scene = story.scenes.find(scene => scene.id === currentSceneId);
    setCurrentScene(scene || null);
    // 学習ポイントが表示されている場合はリセット
    setShowLearningPoint(false);
    // テキストアニメーションをリセット
    setTextAnimated(false);
    
    // テキストアニメーションを開始
    const timer = setTimeout(() => {
      setTextAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentSceneId, story.scenes]);

  // 選択肢のクリックハンドラ
  const handleChoiceClick = (choice: Choice) => {
    // 履歴に現在のシーンを追加
    setHistory([...history, currentSceneId]);
    
    // トランジション効果を開始
    setIsTransitioning(true);
    
    // 少し遅延させてから次のシーンに移動
    setTimeout(() => {
      setCurrentSceneId(choice.nextScene);
      setIsTransitioning(false);
    }, 500);
  };

  // 前のシーンに戻る
  const goBack = () => {
    if (history.length > 0) {
      const previousScene = history[history.length - 1];
      setCurrentSceneId(previousScene);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  // 最初からやり直し
  const restart = () => {
    setCurrentSceneId(story.initialScene);
    setHistory([]);
  };

  // 学習ポイントの表示/非表示
  const toggleLearningPoint = () => {
    setShowLearningPoint(!showLearningPoint);
  };

  if (!currentScene) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">エラー</h3>
          <p className="text-gray-600 mb-6">シーンが見つかりません。</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-auto">
      <div className="max-w-4xl w-full mx-auto p-4">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">{story.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={restart}
              className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm flex items-center"
              title="最初からプレイする"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              リスタート
            </button>
            <button
              onClick={onClose}
              className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm flex items-center"
              title="プレビューを閉じる"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              閉じる
            </button>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div 
          className={`bg-white rounded-xl overflow-hidden transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* シーン画像部分 */}
          <div className="relative h-64 bg-gray-800">
            {currentScene.sceneImageUrl ? (
              <Image
                src={currentScene.sceneImageUrl} 
                alt={currentScene.background} 
                className="w-full h-full object-cover"
                width={256}
                height={144}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900">
                <p className="text-gray-400 italic">
                  {currentScene.background || "シーン画像"}
                </p>
              </div>
            )}
            
            {/* 学習ポイントボタン（あれば表示） */}
            {currentScene.learningPoint && (
              <button
                onClick={toggleLearningPoint}
                className="absolute bottom-4 right-4 bg-[var(--primary)] text-white rounded-full p-2 shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
                title={showLearningPoint ? "学習ポイントを隠す" : "学習ポイントを表示"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            )}
            
            {/* 戻るボタン（履歴がある場合のみ表示） */}
            {history.length > 0 && (
              <button
                onClick={goBack}
                className="absolute bottom-4 left-4 bg-gray-700 text-white rounded-full p-2 shadow-lg hover:bg-gray-600 transition-colors"
                title="前のシーンに戻る"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* テキスト部分 */}
          <div className="p-6">
            <p 
              className={`text-gray-800 text-lg leading-relaxed mb-6 transition-opacity duration-1000 ${textAnimated ? 'opacity-100' : 'opacity-0'}`}
            >
              {currentScene.text}
            </p>
            
            {/* 選択肢 */}
            {currentScene.choices && currentScene.choices.length > 0 ? (
              <div className="space-y-3 mt-8">
                {currentScene.choices.map((choice, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[var(--primary-light)] hover:border-[var(--primary)] transition-colors"
                    onClick={() => handleChoiceClick(choice)}
                  >
                    <span className="inline-block min-w-6 mr-2 text-center text-xs font-bold text-gray-400">{index + 1}</span>
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-8 text-center">
                <button
                  onClick={restart}
                  className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  ストーリーを最初から
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 学習ポイント（表示フラグがtrueの場合のみ表示） */}
        {showLearningPoint && currentScene.learningPoint && (
          <div className="mt-4 bg-[var(--primary-light)] rounded-xl p-5 border border-[var(--primary)] border-opacity-20 animate-fade-in-up">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary)] mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-[var(--primary)] mb-2">{currentScene.learningPoint.title}</h3>
                <p className="text-gray-700">{currentScene.learningPoint.content}</p>
              </div>
            </div>
            <button
              onClick={toggleLearningPoint}
              className="mt-4 text-[var(--primary)] font-medium hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}