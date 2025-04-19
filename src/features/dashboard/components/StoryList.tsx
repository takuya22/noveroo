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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
      {/* カバー画像部分（画像がない場合はプレースホルダー） */}
      <Link href={`/stories/${story.id}`} className="block">
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
      </Link>
      
      {/* コンテンツ部分 */}
      <div className="p-4">
        <Link href={`/stories/${story.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-800 hover:text-[var(--primary)] transition-colors">
            {story.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{story.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">更新日: {formattedDate}</span>
          
          <div className="flex space-x-2">
            {/* 編集ボタン */}
            <Link 
              href={`/dashboard/stories/${story.id}/edit`}
              className="p-1 text-gray-500 hover:text-[var(--primary)] transition-colors"
              title="編集"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            
            {/* プレビューボタン */}
            <Link 
              href={`/dashboard/stories/${story.id}`}
              className="p-1 text-gray-500 hover:text-[var(--primary)] transition-colors"
              title="プレビュー"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}