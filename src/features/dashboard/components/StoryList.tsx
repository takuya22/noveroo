"use client";

import Link from 'next/link';

export default function StoryList({ stories = [] }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

// ストーリーカード
function StoryCard({ story }) {
  // Firestoreのタイムスタンプまたは日付文字列に対応
  const updatedAt = story.metadata?.updatedAt 
    ? new Date(
        typeof story.metadata.updatedAt === 'object' && 'toDate' in story.metadata.updatedAt 
          ? story.metadata.updatedAt.toDate() 
          : story.metadata.updatedAt
      )
    : new Date();

  const formattedDate = updatedAt.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/dashboard/stories/${story.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
        {/* カバー画像部分（画像がない場合はプレースホルダー） */}
        <div className="h-40 bg-gray-100 relative">
          {story.thumbnailURL ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${story.thumbnailURL})` }}
            ></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-3xl text-gray-300">Noveroo</div>
            </div>
          )}
          
          {/* ステータスバッジ */}
          <div className="absolute top-3 right-3">
            {story.metadata?.visibility === 'public' ? (
              <span className="bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full">公開中</span>
            ) : (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">非公開</span>
            )}
          </div>
        </div>
        
        {/* コンテンツ部分 */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 group-hover:text-[var(--primary)] transition-colors">
            {story.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{story.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">更新日: {formattedDate}</span>
            <svg
              className="h-5 w-5 text-gray-400 group-hover:text-[var(--primary)] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}