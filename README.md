# Noveroo

AIを活用してシミュレーションゲーム（ノベルゲーム形式）を簡単に作成できるWebサービスです。

## 🎯 プロジェクト概要

Noverooは、ユーザーが簡単なテーマ入力から始めて、AIが自動的にストーリー、選択肢、学習ポイントを含む対話型ゲームを生成するプラットフォームです。

### 主要機能
- AIによるストーリー生成（Google Gemini API）
- AIによる画像生成（Stability AI）
- インタラクティブなストーリープレイヤー
- ストーリーの保存・編集・共有
- 教育的要素（学習ポイント）の組み込み

### ターゲットユーザー
- **教育者**: 教材作成を簡単に行いたい先生
- **クリエイター**: 自己表現の手段を求める学生・若者
- **シニア**: 新しい技術を使って創作活動を楽しみたい人

## 🏗️ アーキテクチャ

### 技術スタック

#### フロントエンド/バックエンド
- **Next.js 15** (App Router)
  - React 19
  - TypeScript
  - TailwindCSS
  - フルスタックフレームワークでモノレポ管理

#### 認証・セッション管理
- **NextAuth.js**
  - Googleログイン対応
  - OAuthベースの認証システム

#### ホスティング
- **Google Cloud Run**
  - Dockerベースのサーバレス環境
  - CLIデプロイとCI/CD対応

#### データストレージ
- **Firebase Firestore**: 構造化データ（ストーリー、シーン、選択肢）
- **Firebase Storage**: 画像・音声ファイル

#### AI生成サービス
- **Google Gemini 2.5 Pro**: ストーリー・シナリオ生成
- **Google Text-to-Speech**: 音声生成
- **Stability AI**: 背景画像生成

### データフロー
```
ユーザー入力 → Gemini API → ストーリー生成 → 画像生成 → Firebase保存 → プレイヤー表示
```

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- Google Cloud Project（Gemini API、Text-to-Speech API有効化）
- Firebase Project（Firestore、Storage有効化）
- Stability AI APIキー

### 環境変数設定
```bash
# Google AI APIs
GEMINI_API_KEY=your_gemini_api_key
GEMINI_PAID_API_KEY=your_paid_gemini_api_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stability AI
STABILITY_API_KEY=your_stability_api_key

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 開発環境起動

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーは [http://localhost:3001](http://localhost:3001) で起動します。

### ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# プロダクション起動
npm run start
```

## 📁 プロジェクト構造

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # APIエンドポイント
│   │   ├── auth/            # 認証関連API
│   │   ├── stories/         # ストーリー関連API
│   │   └── stripe/          # 決済関連API
│   ├── dashboard/           # ダッシュボードページ
│   └── stories/             # ストーリー表示・プレイページ
├── features/                # 機能別コンポーネント
│   ├── auth/                # 認証関連
│   ├── dashboard/           # ダッシュボード関連
│   ├── landing/             # ランディングページ
│   └── story/               # ストーリー関連
├── hooks/                   # カスタムフック
├── lib/                     # ライブラリ設定
├── providers/               # Reactコンテキスト
├── types/                   # TypeScript型定義
├── ui/                      # 共通UIコンポーネント
└── utils/                   # ユーティリティ関数
    ├── gemini.ts           # AI生成ロジック
    ├── storyModel.ts       # データモデル
    └── storyService.ts     # Firebase連携
```

## 🔧 主要機能詳細

### ストーリー生成プロセス
1. ユーザーがテーマを入力
2. Gemini APIでストーリー・選択肢・学習ポイントを生成
3. Stability AIで背景画像を生成
4. Text-to-Speechで音声を生成
5. Firebaseに構造化データとして保存

### ストーリープレイヤー
- タイプライター効果でテキスト表示
- インタラクティブな選択肢
- 背景画像・音声の同期再生
- 学習ポイントの表示
- プレイ履歴の保存

## 🚀 Google Cloud Runデプロイ

### 前提条件

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) をインストール・設定
2. 請求先アカウントが有効なGoogle Cloudプロジェクト
3. 以下のAPIを有効化:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API
   - Gemini API
   - Text-to-Speech API

### デプロイ手順

#### 1. 認証とプロジェクト設定
```bash
# Google Cloudにログイン
gcloud auth login

# プロジェクトIDを設定
gcloud config set project YOUR_PROJECT_ID
```

#### 2. 環境変数設定
`env.yaml`ファイルを作成し、必要な環境変数を設定:
```yaml
env_vars:
  GEMINI_API_KEY: "your_gemini_api_key"
  GEMINI_PAID_API_KEY: "your_paid_gemini_api_key"
  NEXTAUTH_URL: "https://your-app-url.a.run.app"
  NEXTAUTH_SECRET: "your_nextauth_secret"
  # その他の環境変数...
```

#### 3. Cloud Buildを使用したデプロイ
```bash
# Cloud Buildでビルド・デプロイ
gcloud builds submit --config cloudbuild.yaml
```

#### 4. 直接デプロイ（簡単な方法）
```bash
# ソースコードから直接デプロイ
gcloud run deploy noveroo \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --env-vars-file env.yaml
```

### サービスアカウント設定

Cloud RunでGoogle Cloudサービスを使用する場合のサービスアカウント設定:

1. Cloud Runコンソールでサービスを選択
2. 「新しいリビジョンの編集とデプロイ」をクリック
3. 「セキュリティ」でサービスアカウントを設定
4. 以下のロールを付与:
   - `roles/datastore.user` (Firestore用)
   - `roles/storage.objectAdmin` (Cloud Storage用)
   - `roles/aiplatform.user` (AI API用)

### 本番環境のURL例
デプロイ完了後、`https://noveroo-xxxxx.a.run.app` のようなURLでアクセス可能になります。

## 📋 スクリプト

- `npm run dev`: 開発サーバー起動（ポート3001）
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバー起動
- `npm run lint`: ESLintチェック
- `npm run docker:build`: Dockerイメージビルド
- `npm run docker:run`: Dockerコンテナ実行