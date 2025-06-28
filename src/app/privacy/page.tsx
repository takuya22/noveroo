"use client";

import React from 'react';
import { Footer } from '@/features/landing/components/Footer';
import Header from '@/components/Header';

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-black">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-blue-800">
              最終更新日: 2025年4月26日
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. はじめに</h2>
            <p className="mb-4">
              当社は、AIシミュレーションゲーム作成サービス「Noveroo」（以下「本サービス」といいます）を提供するにあたり、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。本サービスをご利用いただく前に、本ポリシーをお読みいただき、内容にご同意いただきますようお願いいたします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. 収集する情報</h2>
            <p className="mb-4">
              当社は、本サービスの提供にあたり、以下の情報を収集することがあります。
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 ユーザーが提供する情報</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>氏名、メールアドレス、パスワードなどの登録情報</li>
              <li>プロフィール情報（ユーザー名、プロフィール画像など）</li>
              <li>お問い合わせやサポートの際に提供される情報</li>
              <li>アンケートやフィードバックにおいて提供される情報</li>
              <li>支払い情報（今後予定している有料サービスをご利用の場合）</li>
              <li>ユーザーが本サービスを通じて作成するコンテンツ（ストーリー、ゲーム、画像など）</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 自動的に収集される情報</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>デバイス情報（IPアドレス、デバイスの種類、OSのバージョンなど）</li>
              <li>ブラウザの種類、言語設定</li>
              <li>ログ情報（アクセス日時、利用したサービスなど）</li>
              <li>Cookieやウェブビーコンなどを通じて収集される情報</li>
              <li>本サービス内での行動履歴（作成したコンテンツ、プレイ履歴など）</li>
              <li>位置情報（設定で許可している場合）</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 第三者から取得する情報</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>SNSアカウントを利用してログインする場合の当該SNSから提供される情報</li>
              <li>API連携サービス（Google Gemini APIなど）から取得する情報</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. 情報の利用目的</h2>
            <p className="mb-4">
              当社は、収集した情報を以下の目的で利用します。
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザー登録、認証、アカウント管理</li>
              <li>ユーザーからのお問い合わせ対応、サポート提供</li>
              <li>本サービスに関する重要な通知やお知らせの送信</li>
              <li>新機能、アップデート、サービスに関する情報の提供</li>
              <li>マーケティング活動、広告配信（ユーザーの設定に基づく）</li>
              <li>利用状況の分析、統計データの作成</li>
              <li>不正利用の検知、防止、セキュリティの確保</li>
              <li>ストーリー生成回数の制限管理（ベータ版期間中は1日3回まで）</li>
              <li>有料サービス導入後の課金管理（今後予定）</li>
              <li>その他、本サービスの提供に付随する目的</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. 情報の共有・提供</h2>
            <p className="mb-4">
              当社は、以下の場合を除き、収集した個人情報を第三者に提供しません。
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 提供する場合</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、ユーザーの同意を得ることが困難である場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、ユーザーの同意を得ることが困難である場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザーの同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 業務委託先への提供</h3>
            <p className="mb-4">
              当社は、本サービスの提供に必要な範囲内で、個人情報の取り扱いを外部に委託することがあります。この場合、当社は委託先に対して適切な監督を行います。
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 事業承継に伴う提供</h3>
            <p className="mb-4">
              当社は、合併、会社分割、事業譲渡その他の事由によって事業が承継される場合に、事業承継先に個人情報を提供することがあります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. AIサービスとの連携における情報共有</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 外部AIサービスの利用</h3>
            <p className="mb-4">
              本サービスでは、ストーリー生成および画像生成のためにGoogle Gemini APIなどの外部AIサービスを利用しています。これらのサービスを利用する際に、ユーザーが提供したプロンプトやコンテンツ情報が当該サービス提供者に送信される場合があります。
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 外部AIサービスのプライバシーポリシー</h3>
            <p className="mb-4">
              外部AIサービスの利用については、それぞれのサービス提供者のプライバシーポリシーが適用されます。ユーザーは、本サービスを利用する前に、これらの外部サービスのプライバシーポリシーを確認することをお勧めします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Cookieの使用</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Cookieとは</h3>
            <p className="mb-4">
              Cookieとは、ウェブサイトがユーザーのブラウザに保存する小さなテキストファイルです。当社は、本サービスの機能向上やユーザー体験の改善のためにCookieを使用しています。
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Cookieの管理</h3>
            <p className="mb-4">
              ユーザーは、ブラウザの設定でCookieを無効にすることができますが、その場合、本サービスの一部機能が正常に動作しない可能性があります。
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">6.3 利用するCookieの種類</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>必須Cookie：本サービスの基本的な機能を提供するために必要なCookie</li>
              <li>機能Cookie：ユーザー設定を記憶し、カスタマイズされた体験を提供するためのCookie</li>
              <li>分析Cookie：サイトの利用状況を分析し、サービス改善に役立てるためのCookie</li>
              <li>広告Cookie：ユーザーの興味に基づいた広告を表示するためのCookie（利用する場合）</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. データの保管と安全管理</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 保管期間</h3>
            <p className="mb-4">
              当社は、収集した個人情報を、本サービスの提供に必要な期間、または法令で定められた期間保管します。不要となった個人情報は、適切な方法で削除または匿名化します。
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 安全管理措置</h3>
            <p className="mb-4">
              当社は、個人情報の漏洩、滅失、毀損を防止するために、以下を含む適切な安全管理措置を講じます。
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>アクセス制御によるデータへのアクセス制限</li>
              <li>暗号化技術の利用</li>
              <li>定期的なセキュリティ監査</li>
              <li>従業員への教育・訓練</li>
              <li>物理的セキュリティ対策</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">7.3 データ管理の委託</h3>
            <p className="mb-4">
              当社は、クラウドサービスやデータセンターなど、第三者のサービスを利用してデータを保管することがありますが、その場合も適切な安全管理措置を講じます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. 本ポリシーの変更</h2>
            <p className="mb-4">
              当社は、法令の変更や本サービスの変更等に応じて、本ポリシーを変更することがあります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. お問い合わせ窓口</h2>
            <p className="mb-4">
              本ポリシーに関するお問い合わせや、個人情報の開示等の請求については、下記窓口までご連絡ください。
            </p>
            <ul className="list-none pl-0 mb-4">
              <li>メールアドレス： king.yanagawa@gmail.com</li>
            </ul>
          </section>
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
