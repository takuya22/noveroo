"use client";

import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  updatedAt: string;
  status: 'published' | 'draft';
}

export default function ProjectsList() {
  // サンプルデータ（実際にはAPIやFirestoreから取得する）
  const projects = [
    {
      id: 'project-1',
      title: '英語学習ノベル - 初級編',
      description: '簡単な英語フレーズを学べるインタラクティブストーリー',
      coverImage: '/images/project1.jpg',
      updatedAt: '2023-11-10T12:00:00Z',
      status: 'published',
    } as Project, // 型を指定
    {
      id: 'project-2',
      title: '日本史アドベンチャー',
      description: '江戸時代を舞台にした歴史学習ゲーム',
      coverImage: '/images/project2.jpg',
      updatedAt: '2023-11-08T15:30:00Z',
      status: 'draft',
    } as Project,
    {
      id: 'project-3',
      title: 'SFミステリー',
      description: '近未来を舞台にした謎解きアドベンチャー',
      coverImage: '/images/project3.jpg',
      updatedAt: '2023-11-05T09:15:00Z',
      status: 'published',
    } as Project,
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

// プロジェクトカード
function ProjectCard({ project }: { project: Project }) {
  const formattedDate = new Date(project.updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
        {/* カバー画像部分（画像がない場合はプレースホルダー） */}
        <div className="h-40 bg-gray-100 relative">
          {project.coverImage ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${project.coverImage})` }}
            ></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-3xl text-gray-300">Noveroo</div>
            </div>
          )}
          
          {/* ステータスバッジ */}
          <div className="absolute top-3 right-3">
            {project.status === 'published' ? (
              <span className="bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full">公開中</span>
            ) : (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">下書き</span>
            )}
          </div>
        </div>
        
        {/* コンテンツ部分 */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 group-hover:text-[var(--primary)] transition-colors">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{project.description}</p>
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
