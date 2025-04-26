import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../providers/NextAuthProvider";
import { AuthProvider } from "../providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// デフォルトのメタデータ
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://noveroo.com"),
  title: {
    default: "Noveroo - AIでシミュレーションゲームを簡単に作成",
    template: "%s | Noveroo"
  },
  description: "AIを活用して誰でも簡単にシミュレーションゲームを作成できるプラットフォーム。教育、創作活動に最適です。",
  keywords: "AI, シミュレーション, ゲーム, 教育, 創作, ノベルゲーム, 学習教材, オンライン教育",
  authors: [{ name: 'Noveroo Team' }],
  creator: "Noveroo Team",
  publisher: "Noveroo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      'ja-JP': "/ja",
      'en-US': "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://noveroo.com",
    siteName: "Noveroo",
    title: "Noveroo - AIでシミュレーションゲームを簡単に作成",
    description: "AIを活用して誰でも簡単にシミュレーションゲームを作成できるプラットフォーム。教育、創作活動に最適です。",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Noveroo - AIでシミュレーションゲームを簡単に作成',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noveroo - AIでシミュレーションゲームを簡単に作成",
    description: "AIを活用して誰でも簡単にシミュレーションゲームを作成できるプラットフォーム。教育、創作活動に最適です。",
    images: ['/og-image.png'],
    creator: "@noveroo_app",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#3b82f6', // プライマリカラー
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // 実際のコードに置き換える
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
