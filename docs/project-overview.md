# Noveroo プロジェクトドキュメント

## 1. プロジェクト概要

### 1.1 Noverooとは
Noverooは、AIを活用してシミュレーションゲーム（ノベルゲーム形式）を簡単に作成できるWebサービスです。ユーザーは簡単なテーマ入力から始めて、AIが自動的にストーリー、選択肢、学習ポイントを含む対話型ゲームを生成します。

### 1.2 主要機能
- AIによるストーリー生成（Google Gemini API活用）
- AIによる画像生成（Imagen API活用）
- インタラクティブなストーリープレイヤー
- ストーリーの保存・編集・共有
- 教育的要素（学習ポイント）の組み込み

### 1.3 ターゲットユーザー（ペルソナ）
- **教育者**: 教材作成を簡単に行いたい先生
- **クリエイター**: 自己表現の手段を求める学生・若者
- **シニア**: 新しい技術を使って創作活動を楽しみたい人

### 1.4 技術スタック
- フロントエンド: Next.js, React, TailwindCSS
- バックエンド: Next.js API Routes
- 認証: NextAuth.js
- データベース: Firebase Firestore
- ストレージ: Firebase Storage
- AI: Google Gemini API, Google Imagen API

## 2. アーキテクチャ概要

### 2.1 全体アーキテクチャ図
```
┌─────────────────────────────────────┐
│            クライアント             │
│ ┌─────────┐  ┌─────────┐  ┌───────┐ │
│ │ランディング│ │ダッシュボード│ │エディタ│ │
│ └─────────┘  └─────────┘  └───────┘ │
│ ┌─────────┐  ┌─────────┐            │
│ │プレイヤー │  │  認証  │            │
│ └─────────┘  └─────────┘            │
└───────────────┬─────────────────────┘
                │
┌───────────────┼─────────────────────┐
│          Next.js API Routes         │
│ ┌─────────┐  ┌─────────┐  ┌───────┐ │
│ │ストーリー生成│ │ 認証API │  │画像生成│ │
│ └─────────┘  └─────────┘  └───────┘ │
└───────────────┬─────────────────────┘
                │
┌───────────────┼─────────────────────┐
│          外部サービス               │
│ ┌─────────┐  ┌─────────┐  ┌───────┐ │
│ │ Gemini  │  │Firebase │  │Imagen │ │
│ │  API    │  │        │  │ API   │ │
│ └─────────┘  └─────────┘  └───────┘ │
└─────────────────────────────────────┘
```

### 2.2 データフロー

1. **ストーリー生成フロー**:
   - ユーザーがテーマを入力 → API呼び出し → Gemini APIでストーリー生成 → 画像生成 → Firebaseに保存 → ユーザーに結果表示

2. **ストーリープレイフロー**:
   - ストーリー読み込み → シーン表示 → ユーザー選択 → 次のシーン表示 → 結果記録

### 2.3 主要コンポーネント関係
```
┌─────────────────────┐      ┌────────────────┐
│  StoryGenerator     │──────►│   StoryModel   │
└───────────┬─────────┘      └────────────────┘
            │                       ▲
            ▼                       │
┌─────────────────────┐      ┌────────────────┐
│  StoryService       │◄─────►│   Firebase    │
└───────────┬─────────┘      └────────────────┘
            │                       ▲
            ▼                       │
┌─────────────────────┐      ┌────────────────┐
│  StoryPlayer        │      │   AuthService  │
└─────────────────────┘      └────────────────┘
```

## 3. ディレクトリ構造と主要ファイル

### 3.1 ディレクトリ構造解説
```
/src
├── app/                     # Next.js App Routerのルート
│   ├── api/                 # APIエンドポイント
│   │   ├── auth/            # 認証関連API
│   │   └── story/           # ストーリー関連API
│   ├── dashboard/           # ユーザーダッシュボード
│   └── stories/             # ストーリー表示・プレイ
├── features/                # 機能ごとのコンポーネント
│   ├── auth/                # 認証関連コンポーネント
│   ├── dashboard/           # ダッシュボード関連コンポーネント
│   ├── landing/             # ランディングページコンポーネント
│   └── story/               # ストーリー関連コンポーネント
├── hooks/                   # カスタムフック
├── lib/                     # ライブラリラッパー
├── providers/               # Reactコンテキストプロバイダー
├── types/                   # TypeScript型定義
├── ui/                      # 共通UIコンポーネント
└── utils/                   # ユーティリティ関数
```

### 3.2 主要ファイルとその役割

| ファイルパス | 役割 |
|-------------|------|
| `/src/utils/gemini.ts` | Gemini APIを使用したストーリー生成と画像生成の実装 |
| `/src/utils/storyModel.ts` | ストーリーとシーンのデータモデル定義 |
| `/src/utils/storyService.ts` | Firebaseとの連携によるストーリー操作 |
| `/src/features/story/components/StoryPlayer.tsx` | ストーリープレイヤーUIの実装 |
| `/src/app/api/story/generate/route.ts` | ストーリー生成APIエンドポイント |
| `/src/lib/firebase.ts` | Firebase設定とインスタンス |
| `/src/app/page.tsx` | ランディングページ |
| `/src/app/dashboard/page.tsx` | ダッシュボードページ |
| `/src/app/stories/[id]/play/page.tsx` | ストーリープレイページ |

## 4. 主要データモデル

### 4.1 Story（ストーリー）
```typescript
interface Story {
  title: string;              // ストーリータイトル
  description: string;        // ストーリー説明
  initialScene: string;       // 初期シーンID
  scenes: Scene[];            // シーンの配列
  thumbnailURL?: string;      // サムネイル画像URL
  metadata?: Metadata;        // メタデータ
}

interface Metadata {
  creator: Creator;           // 作成者情報
  createdAt?: Date;           // 作成日時
  updatedAt?: Date;           // 更新日時
  visibility?: 'public' | 'private' | 'unlisted';  // 公開設定
  category?: string;          // カテゴリ
  tags?: string[];            // タグ
  difficulty?: string;        // 難易度
}

interface Creator {
  userId?: string;            // 作成者ID
  username?: string;          // 作成者名
}
```

### 4.2 Scene（シーン）
```typescript
interface Scene {
  id: string;                 // シーンID
  type: string;               // シーンタイプ
  background: string;         // 背景説明（画像生成用）
  characters?: Character[];   // 登場キャラクター
  text: string;               // シーンテキスト（日本語）
  textEn: string;            // シーンテキスト（英語）
  choices?: Choice[];         // 選択肢
  sceneImageUrl?: string;     // シーン画像URL
  useGeneratedImage?: boolean; // 生成画像使用フラグ
  learningPoint?: LearningPoint; // 学習ポイント
}

interface Character {
  id: string;                 // キャラクターID
  position: {                 // 位置情報
    x: number;
    y: number;
  };
}
```

### 4.3 Choice（選択肢）
```typescript
interface Choice {
  text: string;               // 選択肢テキスト
  nextScene: string;          // 次のシーンID
}
```

### 4.4 LearningPoint（学習ポイント）
```typescript
interface LearningPoint {
  sceneId: string;            // 対応するシーンID
  title: string;              // 学習ポイントタイトル
  content: string;            // 学習ポイント内容
}
```

### 4.5 Options（生成オプション）
```typescript
interface Options {
  difficulty?: '簡単' | '通常' | '難しい'; // 難易度
  length?: '短い' | '中' | '長い';        // 長さ
  category?: string;                    // カテゴリ
  tags?: string[];                      // タグ
}
```

## 5. 主要機能の詳細

### 5.1 ストーリー生成プロセス

#### 5.1.1 `/utils/gemini.ts`の`generateStory`関数
1. テーマとオプションを入力として受け取る
2. プロンプトを組み立て、Gemini APIに送信
3. 返却されたJSONデータをパース
4. 各シーンの情報を統合
5. 学習ポイントを追加
6. 構造化されたストーリーデータを返却

#### 5.1.2 `/utils/gemini.ts`の`generateImage`関数
1. プロンプトを入力として受け取る
2. プロンプトを効果的な形に整形
3. Imagen APIにリクエストを送信
4. 生成された画像データを処理
5. Firebase Storageに画像をアップロード
6. 画像URLを返却

#### 5.1.3 API実行フロー（`/app/api/story/generate/route.ts`）
1. リクエストからテーマとオプションを抽出
2. ユーザー認証情報を確認
3. テーマに基づきプロンプトを生成
4. `generateStory`関数を呼び出し
5. 必要に応じて画像生成
6. メタデータを設定
7. Firestoreにデータを保存
8. 結果をクライアントに返却

### 5.2 ストーリープレイヤー（`/features/story/components/StoryPlayer.tsx`）

#### 5.2.1 主要機能
- テキストアニメーション表示
- 選択肢の提示と選択処理
- シーン間の遷移効果
- 背景画像の表示
- 学習ポイントの表示
- 履歴表示
- 設定（テキスト速度、サイズ、効果音など）

#### 5.2.2 状態管理
```typescript
// 主要な状態
const [currentSceneId, setCurrentSceneId] = useState<string>(story.initialScene);
const [activeScene, setActiveScene] = useState<Scene | null>(null);
const [displayedText, setDisplayedText] = useState<string>('');
const [isTyping, setIsTyping] = useState<boolean>(false);
const [textComplete, setTextComplete] = useState<boolean>(false);
const [showChoices, setShowChoices] = useState<boolean>(false);
const [history, setHistory] = useState<Array<{sceneId: string, choice?: string}>>([]); 
```

#### 5.2.3 テキスト表示プロセス
1. シーンが変更されたときに、テキストセグメントを解析
2. 文字ごとにアニメーション表示
3. 表示完了後に選択肢を表示
4. ユーザーの選択に基づき次のシーンに移動

### 5.3 ストーリー管理サービス（`/utils/storyService.ts`）

#### 5.3.1 主要関数
- `saveStory`: 新規ストーリーの保存
- `getUserStories`: ユーザーのストーリー一覧取得
- `getStory`: 特定ストーリーの取得
- `updateStory`: ストーリーの更新
- `deleteStory`: ストーリーの削除
- `getPublicStories`: 公開ストーリー一覧の取得

#### 5.3.2 Firebaseとの連携
```typescript
// 例: ストーリー保存処理
export async function saveStory(story: Story, userId: string) {
  try {
    // メタデータ設定
    const storyToSave = {
      ...story,
      metadata: {
        ...story.metadata,
        creator: {
          userId,
          username: story.metadata?.creator?.username || '匿名ユーザー'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    };

    // Firestoreに保存
    const storyRef = await addDoc(collection(db, 'stories'), storyToSave);
    return { id: storyRef.id, ...storyToSave };
  } catch (error) {
    console.error('Error saving story:', error);
    throw new Error('ストーリーの保存に失敗しました');
  }
}
```

## 6. UIコンポーネント階層

### 6.1 ページ構成
- `app/page.tsx`: ランディングページ
  - `features/landing/components/LandingPage.tsx`
    - `features/landing/components/Header.tsx`
    - `features/landing/components/HeroSection.tsx`
    - `features/landing/components/FeaturesSection.tsx`
    - `features/landing/components/UserTypesSection.tsx`
    - `features/landing/components/CtaSection.tsx`
    - `features/landing/components/Footer.tsx`

- `app/dashboard/page.tsx`: ダッシュボード
  - `features/dashboard/components/DashboardHeader.tsx`
  - `features/dashboard/components/DashboardSidebar.tsx`
  - `features/dashboard/components/StoryList.tsx` or `EmptyState.tsx`

- `app/dashboard/create/page.tsx`: ストーリー作成
  - `features/dashboard/components/StoryEditor.tsx`

- `app/stories/[id]/play/page.tsx`: ストーリープレイ
  - `features/story/components/StoryPlayer.tsx`

### 6.2 共通UIコンポーネント
- `ui/buttons/PrimaryButton.tsx`
- `ui/buttons/SecondaryButton.tsx`
- `ui/modals/Modal.tsx`
- `ui/icons/Play.tsx`

## 7. 認証システム

### 7.1 構成要素
- NextAuth.js を使用した認証
- Firebase Authentication との連携
- 認証状態の共有（AuthProvider）

### 7.2 認証フロー
1. ユーザーがログインフォームを送信
2. NextAuthのAPIが認証処理
3. 成功時にセッション作成
4. Firebaseに認証情報連携
5. AuthProviderを通じて認証状態をアプリ全体で共有

### 7.3 実装例
```typescript
// /hooks/useAuth.ts
export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const isLoading = status === 'loading';
  
  return {
    user: session?.user,
    isAuthenticated,
    isLoading
  };
}

// /providers/AuthProvider.tsx
export function AuthProvider({ children }) {
  const { data: session } = useSession();
  
  useEffect(() => {
    // Firebaseとの同期処理
  }, [session]);
  
  return (
    <AuthContext.Provider value={{ user: session?.user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 8. 拡張性と機能追加ガイド

### 8.1 新機能追加の基本手順
1. `features/` 以下に新機能用のディレクトリを作成
2. 必要なコンポーネント、フック、ユーティリティを実装
3. `app/` 以下に対応するページやAPIエンドポイントを追加
4. 必要に応じてモデルやインターフェースを `types/` に追加

### 8.2 ストーリー生成機能拡張
`/utils/gemini.ts` の `generateStory` 関数を拡張：
- 新しいプロンプトオプションの追加
- 異なるストーリー構造のサポート
- 多言語対応の強化

### 8.3 プレイヤー機能拡張
`/features/story/components/StoryPlayer.tsx` の拡張：
- 音声ナレーション機能の追加
- アニメーション効果の拡充
- 追加のインタラクション要素

### 8.4 新しいAI機能の統合
1. 新しいAI APIのラッパー関数を `/utils/` に作成
2. 適切なリクエスト/レスポンス処理を実装
3. エラーハンドリングとフォールバックの実装
4. 既存機能と統合

## 9. パフォーマンス最適化とベストプラクティス

### 9.1 レンダリング最適化
- コンポーネントの不要な再レンダリング防止
- `React.memo`、`useMemo`、`useCallback` の適切な使用
- 大きなリストには仮想化スクロール（`react-window`など）を使用

### 9.2 データフェッチ最適化
- SWRを使用した効率的なデータ取得と再検証
- 必要なデータのみを要求するクエリの最適化
- 適切なキャッシュ戦略の採用

### 9.3 コード品質の維持
- 一貫した命名規則の遵守
- 単一責任の原則に基づくコンポーネント分割
- 適切なコメントとドキュメント化
- 型定義の徹底

### 9.4 アクセシビリティ考慮事項
- セマンティックなHTML要素の使用
- キーボードナビゲーションのサポート
- スクリーンリーダー対応
- 十分なコントラスト比の確保

## 10. 開発フロー

### 10.1 開発環境のセットアップ
1. リポジトリのクローン
2. 依存パッケージのインストール：`npm install`
3. 環境変数の設定：`.env.local` ファイルの作成
4. 開発サーバーの起動：`npm run dev`

### 10.2 必要な環境変数
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_PAID_API_KEY=your_gemini_paid_api_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# その他
NODE_ENV=development
```

### 10.3 デプロイメントプロセス
1. 本番用ビルド生成：`npm run build`
2. ビルドの検証：`npm run start`
3. Vercelなどのプラットフォームへのデプロイ
4. 環境変数の設定確認

## 11. 参考資料

### 11.1 使用技術のドキュメント
- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- Firebase: https://firebase.google.com/docs
- NextAuth.js: https://next-auth.js.org/
- TailwindCSS: https://tailwindcss.com/docs
- Google AI (Gemini): https://ai.google.dev/docs

### 11.2 APIドキュメント
- Gemini API: https://ai.google.dev/docs/gemini_api
- Firebase Firestore: https://firebase.google.com/docs/firestore
- Firebase Storage: https://firebase.google.com/docs/storage

---

## 付録: コードスニペット集

### A. Gemini APIプロンプト例
```javascript
const prompt = `
テーマ「${theme}」に基づいて対話型のシミュレーションゲームを作成してください。
難易度: ${difficulty}
長さ: ${length}

以下の要素を必ず含めてください:
1. タイトル
2. 説明文（プレイヤー特定の役割を持ち、目標を達成するためのゲームの概要）
3. ストーリー展開（少なくとも5つ、多くとも10つのシーン）
4. 各ストーリー展開の最後以外、各シーンに必ず選択肢（2〜3つ）を含め、プレイヤーの選択によってストーリーが変化する
5. 教育的内容を含む結末

以下のJSONフォーマットで出力してください:
{
  "title": "ゲームタイトル",
  "description": "ゲームの説明",
  "initialScene": "start",
  "scenes": [
    {
      "id": "start",
      "type": "scene",
      "background": "シーンに合わせて背景のプロンプトを英語で一言で記述",
      "characters": [
        {"id": "キャラクターを英語で簡潔に記述。名前もあり。", "position": {"x": 50, "y": 20}}
      ],
      "text": "シーンのテキスト内容（日本語）",
      "text_en": "シーンのテキスト内容（英語）",
      "choices": [
        {
          "text": "選択肢1のテキスト（日本語）",
          "nextScene": "scene_id_1"
        },
        {
          "text": "選択肢2のテキスト（日本語）",
          "nextScene": "scene_id_2"
        }
      ]
    }
  ]
}
`;
```

### B. Firebase設定例
```typescript
// /lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase初期化（シングルトンパターン）
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
```

### C. カスタムフックの例
```typescript
// /hooks/useStories.ts
import { useState, useEffect } from 'react';
import { getUserStories, getPublicStories } from '@/utils/storyService';
import { useAuth } from './useAuth';

export function useStories(type = 'user') {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    async function loadStories() {
      try {
        setLoading(true);
        let result;
        
        if (type === 'user' && isAuthenticated && user?.id) {
          result = await getUserStories(user.id);
        } else if (type === 'public') {
          result = await getPublicStories();
        } else {
          result = [];
        }
        
        setStories(result);
      } catch (err) {
        console.error('Error loading stories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadStories();
  }, [type, user, isAuthenticated]);
  
  return { stories, loading, error };
}
```

### D. 新機能実装例: 音声ナレーション
```typescript
// /features/story/components/temp/speakerUtils.ts
export function speakText(text: string, options = {}) {
  if (!window.speechSynthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // オプションの適用
  Object.assign(utterance, options);
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
```