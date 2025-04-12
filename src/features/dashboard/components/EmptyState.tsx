"use client";

export default function EmptyState() {
  return (
    <div className="text-center py-12 px-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary-light)] text-[var(--primary)] mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">ストーリーを作成しましょう</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        まだストーリーがありません。「新しいストーリーを作る」ボタンをクリックして、あなたの最初のインタラクティブストーリーを作成してください。
      </p>
      <button 
        onClick={() => window.location.href = '/dashboard/create'} 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
      >
        新しいストーリーを作る
        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
