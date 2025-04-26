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
          <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl lg:text-6xl">
              <span className="inline-block mb-2">AIでシミュレーションゲームを</span>
              <span className="inline-block text-[var(--primary)]">簡単に作成</span>
            </h1>
            <p className="relative mt-6 text-lg leading-7 text-gray-600 sm:max-w-md lg:max-w-none">
              Noverooは、最新のAI技術を使って誰でも簡単にインタラクティブなシミュレーションゲームを作れるプラットフォームです。<span className="font-medium text-gray-800">学びながら楽しめる教材作り</span>、個人の創作活動、シニアの方の新しい表現方法として、幅広く活用できます。
            </p>
            <div className="mt-12 flex items-center gap-x-5">
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
