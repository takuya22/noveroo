"use client";

import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-[#f0f9f2] flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V18M6 12H18" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h3 className="text-xl font-medium text-gray-900 mb-2">ストーリー作成を始めましょう</h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        最初のインタラクティブストーリーを作成して、アイデアを形にしましょう。作成したストーリーはここに表示されます。
      </p>
      
      <Link 
        href="/dashboard/create" 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#34a853] hover:bg-[#2d8f46] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34a853]"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        新しいストーリーを作る
      </Link>
      
      <div className="mt-8 px-6 py-4 bg-[#f0f9f2] border border-[#34a853]/20 rounded-lg max-w-md">
        <h4 className="text-sm font-medium text-[#34a853] mb-2">チケットについて</h4>
        <p className="text-xs text-gray-600">
          1日に最大5つのストーリーを生成できます。チケットは毎日午前0時にリセットされます。
        </p>
      </div>
    </div>
  );
}
