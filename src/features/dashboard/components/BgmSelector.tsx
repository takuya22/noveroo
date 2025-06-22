"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_BGMS, BgmDefinition, BGM_CATEGORY_NAMES } from '@/utils/bgmConstants';

interface BgmSelectorProps {
  selectedBgm: string | null;
  onChange: (bgmUrl: string | null) => void;
  className?: string;
}

export default function BgmSelector({ selectedBgm, onChange, className = '' }: BgmSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const categories = [...new Set(AVAILABLE_BGMS.map(bgm => bgm.category))];
  
  // 現在選択されているBGMの情報を取得
  const selectedBgmInfo = AVAILABLE_BGMS.find(bgm => bgm.url === selectedBgm);
  
  // BGMの再生
  const playBgm = (bgmUrl: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // 再生中のBGMがある場合は停止
    if (isPlaying) {
      audioRef.current.pause();
      
      // 同じBGMの場合は停止だけして終了
      if (isPlaying === bgmUrl) {
        setIsPlaying(null);
        return;
      }
    }
    
    // 新しいBGMを設定
    audioRef.current.src = bgmUrl;
    audioRef.current.volume = 0.3;
    audioRef.current.loop = true;
    audioRef.current.play()
      .then(() => setIsPlaying(bgmUrl))
      .catch(err => console.error("BGM再生エラー:", err));
  };
  
  // BGMの停止
  const stopBgm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(null);
  };
  
  // コンポーネントのアンマウント時にBGMを停止
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // カテゴリでフィルタリングされたBGMのリスト
  const filteredBgms = selectedCategory 
    ? AVAILABLE_BGMS.filter(bgm => bgm.category === selectedCategory)
    : AVAILABLE_BGMS;
  
  return (
    <div className={`bg-white rounded-md shadow-md ${className}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">BGM設定</h3>
          {selectedBgmInfo ? (
            <p className="text-sm text-gray-600 mt-1">
              選択中: {selectedBgmInfo.name} ({BGM_CATEGORY_NAMES[selectedBgmInfo.category]})
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">BGMは設定されていません</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedBgm && (
            <button
              onClick={() => isPlaying ? stopBgm() : playBgm(selectedBgm)}
              className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title={isPlaying === selectedBgm ? "停止" : "選択中のBGMを再生"}
            >
              {isPlaying === selectedBgm ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          )}
          
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="BGM選択"
          >
            {showSelector ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            )}
          </button>
          
          {selectedBgm && (
            <button
              onClick={() => onChange(null)}
              className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="BGMを削除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {showSelector && (
        <div className="p-4">
          {/* カテゴリー選択 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">カテゴリー</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {BGM_CATEGORY_NAMES[category]}
                </button>
              ))}
            </div>
          </div>
          
          {/* BGMリスト */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredBgms.map(bgm => (
              <div
                key={bgm.id}
                className={`p-3 rounded-md border transition-colors cursor-pointer ${
                  selectedBgm === bgm.url
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onChange(bgm.url)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{bgm.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{BGM_CATEGORY_NAMES[bgm.category]} - {bgm.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        isPlaying === bgm.url ? stopBgm() : playBgm(bgm.url);
                      }}
                      className={`p-2 rounded-full ${
                        isPlaying === bgm.url
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isPlaying === bgm.url ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}