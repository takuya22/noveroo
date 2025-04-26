"use client";

import Link from 'next/link';

export default function StoryList({ stories = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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

  // ステータスバッジのスタイルを定義
  const statusBadgeStyle = story.metadata?.visibility === 'public'
    ? 'bg-[#34a853]/10 text-[#34a853]'
    : 'bg-gray-100 text-gray-500';

  // 説明が長すぎる場合は短縮
  const truncateDescription = (text, maxLength = 80) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength).trim()}...`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* カバー画像部分 */}
      <div className="h-36 relative">
        <Link href={`/stories/${story.id}`} className="block w-full h-full">
          {story.thumbnailURL ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${story.thumbnailURL})` }}
            ></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f0f9f2] to-[#e6f4fd]">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="32" height="32" rx="2" stroke="#34A853" strokeWidth="2"/>
                <path d="M16 18H32" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 24H28" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 30H24" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          
          {/* オーバーレイグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50"></div>
          
          {/* ステータスバッジ */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeStyle}`}>
              {story.metadata?.visibility === 'public' ? '公開中' : '非公開'}
            </span>
          </div>
        </Link>
      </div>
      
      {/* コンテンツ部分 */}
      <div className="p-4">
        <Link href={`/stories/${story.id}`} className="block">
          <h3 className="text-base font-medium text-gray-900 hover:text-[#34a853] transition-colors line-clamp-1">
            {story.title}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {truncateDescription(story.description)}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          
          <div className="flex space-x-1">
            {/* 編集ボタン */}
            <Link 
              href={`/dashboard/stories/${story.id}/edit`}
              className="p-1.5 text-gray-400 hover:text-[#34a853] rounded-full hover:bg-[#f0f9f2] transition-colors"
              title="編集"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            
            {/* プレビューボタン */}
            <Link 
              href={`/stories/${story.id}/play`}
              className="p-1.5 text-gray-400 hover:text-[#34a853] rounded-full hover:bg-[#f0f9f2] transition-colors"
              title="プレイ"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12L9 16.5V7.5L15 12Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
