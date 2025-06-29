"use client";

import { JSX, SVGProps } from "react";

export const Footer = () => {
  const productLinks = [
    { name: '利用規約', href: '/terms' },
    { name: 'プライバシーポリシー', href: '/privacy' },
  ];

  const socialIcons = [
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
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
        <div className="flex justify-center space-x-6 md:order-2">
          {/* ソーシャルアイコン */}
          {socialIcons.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-gray-400 hover:text-gray-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
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
