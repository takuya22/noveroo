"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
    { name: 'マイプロジェクト', href: '/dashboard/projects', icon: ProjectIcon },
    { name: 'テンプレート', href: '/dashboard/templates', icon: TemplateIcon },
    { name: 'ギャラリー', href: '/dashboard/gallery', icon: GalleryIcon },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-8">
        <div className="bg-[var(--primary-light)] rounded-lg p-4">
          <h3 className="text-[var(--primary)] font-medium mb-2">プレミアムにアップグレード</h3>
          <p className="text-sm text-gray-600 mb-3">より高度な機能を利用して、あなたのストーリーをさらに魅力的に。</p>
          <Link
            href="/pricing"
            className="block w-full text-center bg-[var(--primary)] text-white px-4 py-2 rounded-md text-sm hover:bg-[var(--primary-dark)] transition-colors"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </aside>
  );
}

// アイコンコンポーネント
function HomeIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ProjectIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function TemplateIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function GalleryIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
