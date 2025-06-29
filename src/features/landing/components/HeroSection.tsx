"use client";

import { useState } from 'react';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../ui/buttons/SecondaryButton';
import { PlayIcon } from '../../../ui/icons/Play';
import { AuthModal } from '../../auth/components/AuthModal';
import { MiniGamePreview } from './MiniGamePreview';
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();
  
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-[var(--primary-light)] via-transparent to-[var(--secondary-light)] opacity-20 sm:left-[calc(50%-40rem)] lg:left-[calc(50%-36rem)]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 lg:px-8 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div className="w-full mx-auto max-w-xl text-center lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-4xl lg:text-5xl">
              <span className="inline-block mb-2">学んだ気になっているだけ</span>
              <span className="inline-block text-[var(--primary)]">をシミュレーションで解決</span>
            </h1>
            <p className="relative mt-6 text-lg leading-7 text-gray-600 sm:max-w-md lg:max-w-none">
             YouTubeでの解説動画、ChatGPTを使った検索、オンライン研修...<br />
            これらで「学んでいる」ように感じているけれど、
            </p>
            <div className="border-1 rounded-2xl p-6 border-[var(--primary)] mt-6">
              <p className="text-lg leading-7 text-gray-600">
                💭 <span className='inline-block text-[var(--primary)] font-bold'>「なんとなくわかった」で終わっていませんか？</span>
                  <span className='inline-block mt-1'>知識を得るだけでは、現場で使えるスキルにはなりません。<br />実務に活かせずに忘れ去られることがほとんどです。</span>
                  <span className='inline-block mt-1'>AIが作るインタラクティブなストーリーで、知識を実際に「使う」体験を。</span>
                  <span className='inline-block mt-1'>選択と結果を繰り返すことで、本当に使えるスキルが身に付きます。</span>
              </p>
            </div>
            {/* <p className="mt-3 text-sm font-medium text-[var(--primary)] bg-[var(--primary-light)] bg-opacity-20 inline-block px-3 py-1 rounded-full">
              ベータ版期間中は1日3回まで無料でストーリー生成ができます
            </p> */}
            <div className="mt-12 flex items-center justify-center gap-x-5">
              <PrimaryButton 
                className="rounded-md px-6 py-3 text-base font-medium shadow"
                onClick={() => setAuthModalOpen(true)}
              >
                無料で始める
              </PrimaryButton>
              <div className="flex items-center">
                <SecondaryButton
                className="flex items-center gap-2 rounded-md px-6 py-3 text-base font-medium border-[var(--secondary)]"
                onClick={() => router.push('/stories')}
              >
                  <PlayIcon size={18} />
                  デモを見る
                </SecondaryButton>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:flex-1">
            {/* インタラクティブなミニゲームプレビュー */}
            <div className="relative max-w-xl mx-auto lg:max-w-none" style={{ height: "430px" }}>
              <MiniGamePreview />
              
              {/* 装飾的な背景要素 */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[var(--primary-light)] blur-2xl opacity-30 rounded-full"></div>
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
