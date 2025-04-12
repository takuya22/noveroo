"use client";

import { useState } from 'react';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../ui/buttons/SecondaryButton';
import { PlayIcon } from '../../../ui/icons/Play';
import { AuthModal } from '../../auth/components/AuthModal';

export const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-[var(--primary-light)] via-transparent to-[var(--secondary-light)] opacity-20 sm:left-[calc(50%-40rem)] lg:left-[calc(50%-36rem)]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 lg:px-8 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl lg:text-6xl">
              <span className="inline-block mb-2">AIでノベルゲームを</span>
              <span className="inline-block text-[var(--primary)]">簡単に作成</span>
            </h1>
            <p className="relative mt-6 text-lg leading-7 text-gray-600 sm:max-w-md lg:max-w-none">
              Noverooは、最新のAI技術を使って誰でも簡単にインタラクティブなノベルゲームを作れるプラットフォームです。<span className="font-medium text-gray-800">学びながら楽しめる教材作り</span>、個人の創作活動、シニアの方の新しい表現方法として、幅広く活用できます。
            </p>
            <div className="mt-12 flex items-center gap-x-5">
              <PrimaryButton 
                className="rounded-md px-6 py-3 text-base font-medium shadow"
                onClick={() => setAuthModalOpen(true)}
              >
                無料で始める
              </PrimaryButton>
              <div className="flex items-center">
                <SecondaryButton className="flex items-center gap-2 rounded-md px-6 py-3 text-base font-medium border-[var(--secondary)]">
                  <PlayIcon size={18} />
                  デモを見る
                </SecondaryButton>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:ml-10 lg:flex-1">
            <div className="relative max-w-xl mx-auto lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="h-96 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="h-14 bg-[var(--gray-100)] border-b border-gray-200 flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-[var(--gray-300)] mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-[var(--gray-300)] mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-[var(--gray-300)]"></div>
                    <div className="ml-4 px-3 py-1 bg-white rounded text-xs text-[var(--gray-600)] border border-[var(--gray-200)]">ストーリーエディタ</div>
                  </div>
                  <div className="p-4 flex flex-col h-[calc(100%-3.5rem)]">
                    <div className="bg-[var(--primary-light)] rounded-lg p-3 mb-3 text-sm text-[var(--gray-800)]">
                      「魔法の森で出会った不思議な生き物」のストーリーを作成しています...
                    </div>
                    <div className="bg-[var(--gray-50)] rounded-lg p-3 mb-3 flex-grow text-sm text-[var(--gray-800)]">
                      森の小道を進んでいると、キラキラと光る小さな生き物に出会った。その生き物は...
                      <span className="inline-block w-2 h-4 bg-[var(--primary)] opacity-50 animate-pulse ml-1"></span>
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded text-xs font-medium">AIで続きを生成</button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs">分岐を追加</button>
                      </div>
                      <button className="px-3 py-1 bg-[var(--secondary-light)] text-[var(--secondary-dark)] rounded text-xs font-medium">プレビュー</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 認証モーダル */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode="signup"
      />
    </div>
  );
};
