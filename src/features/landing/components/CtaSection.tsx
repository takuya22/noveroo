import Link from 'next/link';
import { PrimaryButton } from '../../../ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../ui/buttons/SecondaryButton';

export const CtaSection = () => {
  return (
    <div className="relative isolate bg-white z-0">
      <div className="absolute inset-x-0 top-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl" aria-hidden="true">
        <div
          className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#34a853] to-[#ffbb00] opacity-25"
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
        ></div>
      </div>
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            今すぐ始めてみませんか？
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-gray-600">
            Noverooは完全無料で始められます。最新のAI技術の力で、あなたのアイデアを魅力的なノベルゲームに変えましょう。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pb-4">
            <PrimaryButton className="rounded-md px-8 py-3 text-base font-medium shadow-lg">
              無料で始める
            </PrimaryButton>
            <Link href="/stories">
              <SecondaryButton className="rounded-md px-6 py-3 text-base font-medium border-[var(--primary-light)]">
                公開ストーリーを見る
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
