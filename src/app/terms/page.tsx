"use client";

import React from 'react';
import Link from 'next/link';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-black">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-blue-800">
              最終更新日: 2025年4月26日
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. はじめに</h2>
            <p className="mb-4">
              本利用規約（以下「本規約」といいます）は、当社が提供するAIシミュレーションゲーム作成サービス「Noveroo」（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意いただいた上で本サービスをご利用いただきます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. 定義</h2>
            <p className="mb-4">
              本規約において使用する用語の意義は、次の各号に定めるとおりとします。
            </p>
            <ol className="list-decimal pl-5 mb-4">
              <li>「当社」とは、本サービスを提供する事業者を指します。</li>
              <li>「ユーザー」とは、本規約に同意の上、本サービスを利用する個人または法人を指します。</li>
              <li>「コンテンツ」とは、ユーザーが本サービスを通じて作成、投稿、共有するテキスト、画像、ストーリー、ゲーム等のデータを指します。</li>
              <li>「AI生成コンテンツ」とは、本サービスのAI機能を利用して生成されたコンテンツを指します。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. 本規約の適用と変更</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>本規約は、本サービスの提供条件および本サービスの利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。</li>
              <li>当社は、ユーザーの承諾を得ることなく、本規約を変更することがあります。変更後の本規約は、当社が別途定める場合を除いて、本サービス上に表示した時点より効力を生じるものとします。</li>
              <li>当社が本規約を変更した場合、ユーザーは変更後に本サービスを利用することにより、変更後の規約に同意したものとみなされます。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. 登録と利用</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>本サービスの利用を希望する者は、本規約に同意の上、当社の定める方法により利用登録を行うものとします。</li>
              <li>当社は、登録希望者が以下の各号のいずれかに該当する場合は、登録を拒否することがあります。
                <ul className="list-disc pl-5 mt-2">
                  <li>過去に本規約違反等により、利用登録の取消処分を受けたことがある場合</li>
                  <li>登録情報に虚偽、誤記または記載漏れがある場合</li>
                  <li>未成年者、成年被後見人、被保佐人または被補助人のいずれかであり、法定代理人、後見人、保佐人または補助人の同意等を得ていない場合</li>
                  <li>その他、当社が登録を適当でないと判断した場合</li>
                </ul>
              </li>
              <li>ユーザーは、登録情報に変更があった場合、遅滞なく当社の定める方法で変更手続きを行うものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. アカウント管理</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>ユーザーは、自己の責任において、本サービスのアカウントを適切に管理するものとします。</li>
              <li>ユーザーは、いかなる場合にも、アカウントを第三者に譲渡または貸与することはできません。</li>
              <li>ユーザーのアカウントの管理不十分、使用上の過誤、第三者の使用等による損害の責任はユーザーが負うものとし、当社は一切の責任を負いません。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. サービスの利用</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>ユーザーは、本規約に従って本サービスを利用するものとします。</li>
              <li>ユーザーは、本サービスの利用に際して、以下の行為を行ってはならないものとします。
                <ul className="list-disc pl-5 mt-2">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当社のサーバーやネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li>当社のサービスの運営を妨害する行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>他のユーザーに成りすます行為</li>
                  <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                  <li>当社、本サービスの他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為</li>
                  <li>過度に暴力的な表現、露骨な性的表現、人種、国籍、信条、性別、社会的身分、門地等による差別につながる表現、自殺、自傷行為、薬物乱用を誘引または助長する表現、その他反社会的な内容を含み他人に不快感を与える表現を投稿する行為</li>
                  <li>営業、宣伝、広告、勧誘、その他営利を目的とする行為（当社が認めたものを除きます）</li>
                  <li>面識のない異性との出会いを目的とした行為</li>
                  <li>他のユーザーに対する嫌がらせや誹謗中傷を目的とした行為</li>
                  <li>その他、当社が不適切と判断する行為</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. コンテンツに関する権利</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>ユーザーが本サービスを通じて投稿したコンテンツの著作権は、原則としてユーザーに帰属します。ただし、AI生成コンテンツについては、本サービスの利用規約およびAIサービス提供元の利用規約に従うものとします。</li>
              <li>ユーザーは、自らが投稿したコンテンツについて、当社に対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な利用、複製、配布、派生著作物の作成、表示および実行に関するライセンスを付与します。</li>
              <li>ユーザーは、自らが投稿したコンテンツについて、当社および当社から権利を承継しまたは許諾された者に対して著作者人格権を行使しないことに同意するものとします。</li>
              <li>ユーザーは、自らが投稿したコンテンツについて、第三者の権利を侵害していないことを保証するものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. AI生成コンテンツに関する特則</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>本サービスを通じて生成されるAI生成コンテンツは、外部のAIサービス提供元（Google Gemini APIなど）の利用規約および制限事項に従うものとします。</li>
              <li>ユーザーは、AI生成コンテンツを利用する際、それらが完全に正確であることを保証するものではなく、AI技術の特性上、不適切、不正確、または誤解を招く内容が含まれる可能性があることを理解し、同意するものとします。</li>
              <li>ユーザーは、AI生成コンテンツを商用利用する場合、適用される法律および規制に従うものとします。</li>
              <li>当社は、AI生成コンテンツに関して発生する知的財産権の問題、第三者の権利侵害、または法的責任について、一切の責任を負わないものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. 有料サービス</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>本サービスは現在ベータ版として提供されており、ユーザーは1日3回までストーリーを無料で生成できます。当社は将来的に本サービスの一部または全部を有料化する予定です。</li>
              <li>有料サービス導入後の利用料金、支払方法、その他の条件については、当社が別途定めるものとします。</li>
              <li>ユーザーは、有料サービスの利用に際して、当社が指定する支払方法により、利用料金を支払うものとします。</li>
              <li>利用料金の支払いが遅延した場合、ユーザーは年14.6%の割合による遅延損害金を当社に支払うものとします。</li>
              <li>当社は、ユーザーが有料サービスの利用料金を支払わない場合、当該ユーザーの有料サービスの利用を制限または停止することができるものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. 退会およびサービスの停止</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>ユーザーは、当社の定める方法により、いつでも退会することができます。</li>
              <li>当社は、ユーザーに通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. 保証の否認および免責事項</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを保証するものではありません。</li>
              <li>当社は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。</li>
              <li>当社は、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">12. サービス内容の変更・終了</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>当社は、ユーザーに通知することなく、本サービスの内容を変更し、または本サービスの提供を中止することができるものとします。</li>
              <li>当社は、本サービスの変更または中止によってユーザーに生じた損害について、一切の責任を負わないものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">13. 利用規約の変更</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>当社は、必要と判断した場合には、ユーザーに通知することなく、本規約を変更することができるものとします。</li>
              <li>ユーザーは、本規約の変更後、本サービスを利用した時点で、変更後の本規約に同意したものとみなされます。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">14. 個人情報の取り扱い</h2>
            <p className="mb-4">
              当社は、本サービスの利用によって取得する個人情報については、当社「<Link href="/privacy" className="text-[var(--primary)] hover:underline">プライバシーポリシー</Link>」に従い適切に取り扱うものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">15. 通知または連絡</h2>
            <p className="mb-4">
              ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">16. 権利義務の譲渡の禁止</h2>
            <p className="mb-4">
              ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">17. 準拠法・裁判管轄</h2>
            <ol className="list-decimal pl-5 mb-4">
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">18. クレジット表記</h2>
            <p className="mb-4">
              本サービスでは、以下の素材を使用しています。
            </p>
            <ul className="list-none pl-0 mb-4">
              <li>音楽：魔王魂</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">19. お問い合わせ窓口</h2>
            <p className="mb-4">
              本規約に関するお問い合わせは、下記のメールアドレスまでお願いいたします。
            </p>
            <ul className="list-none pl-0 mb-4">
              <li>メールアドレス： king.yanagawa@gmail.com</li>
            </ul>
          </section>

          <p className="text-right italic text-gray-600 mt-12">
            制定日：2025年4月26日
          </p>
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
