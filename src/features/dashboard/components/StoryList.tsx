"use client";

import { Story } from '@/utils/storyModel';
import Link from 'next/link';

export default function StoryList({ stories = [] }: { stories: Story[] }) {
  return (
    <div className="flex flex-col space-y-3">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

// ストーリーカード
function StoryCard({ story }: { story: Story }) {
  // Firestoreのタイムスタンプまたは日付文字列に対応
  const createdAt = story.metadata?.createdAt
    ? new Date(
        typeof story.metadata.createdAt === 'object' && 'toDate' in story.metadata.createdAt 
          ? story.metadata.createdAt.toDateString()
          : story.metadata.createdAt
      )
    : new Date();

  // 公開状態の表示
  const isPublic = story.metadata?.visibility === 'public';

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* タイトルと説明 */}
      <div className="flex-grow">
        <div className="flex items-center">
          <Link href={`/stories/${story.id}/play`} className="text-base font-medium text-gray-900 hover:text-[#34a853] transition-colors">
            {story.title}
          </Link>
          {isPublic && (
            <span className="ml-2 text-xs text-[#34a853] border border-[#34a853] rounded px-1.5 py-0.5">公開</span>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span>{createdAt.toLocaleDateString('ja-JP')}作成</span>
        </div>
      </div>
      
      {/* アクションボタン */}
      <div className="flex space-x-2 ml-4">
        {/* 編集ボタン */}
        <Link 
          href={`/dashboard/stories/${story.id}/edit`}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          編集
        </Link>
        
        {/* プレビューボタン */}
        <Link 
          href={`/stories/${story.id}/play`}
          className="px-3 py-1.5 text-sm text-white bg-[#34a853] rounded hover:bg-[#2d8f46] transition-colors"
        >
          再生
        </Link>
      </div>
    </div>
  );
}
