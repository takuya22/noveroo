"use client";

export const Footer = () => {
  const productLinks = [
    { name: '利用規約', href: '/terms' },
    { name: 'プライバシーポリシー', href: '/privacy' },
  ];

  // ページ内リンクのスクロール関数
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 relative z-10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900">Noveroo</span>
          </div>
          {/* 製品情報リンク */}
          <nav className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
            {productLinks.map((link) => {
              // 内部ハッシュリンク
              if (link.href.startsWith('#')) {
                return (
                  <button 
                    key={link.name}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 cursor-pointer"
                    onClick={() => scrollToSection(link.href.substring(1))}
                  >
                    {link.name}
                  </button>
                );
              } 
              // 外部リンク
              else {
                return (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </a>
                );
              }
            })}
          </nav>
          <p className="mt-6 text-center text-xs leading-5 text-gray-500 md:text-left">
            &copy; 2025 Noveroo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
