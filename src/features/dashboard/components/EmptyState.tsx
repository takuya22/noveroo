"use client";

import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300 mb-4">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      
      <h3 className="text-lg font-medium text-gray-700 mb-2">ストーリーがありません</h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
        新しいストーリーを作成して、あなたのアイデアを形にしましょう
      </p>
      
      <Link 
        href="/dashboard/create" 
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#34a853] hover:bg-[#2d8f46] transition-colors"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        新しいストーリーを作る
      </Link>
    </div>
  );
}
