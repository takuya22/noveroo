/**
 * ストーリーのデータモデルを定義するファイル
 */

export interface Character {
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Quote {
  text: string;
  speaker?: string; // 発言者の名前（オプション）
  speaker_type?: string; // 発言者のタイプ（例: 'hero', 'villain'など）
}

export interface Choice {
  text: string;
  nextScene: string;
}

export interface LearningPoint {
  sceneId: string;
  title: string;
  content: string;
}

// Quiz関連の新しいインターフェースを追加
export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation?: string; // 選択肢を選んだ際の解説
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  explanation: string; // 問題に関する総合的な解説
}

export interface Scene {
  id: string;
  type: string;
  background: string;
  characters?: Character[];
  text: Quote[];
  textEn: Quote[];
  choices?: Choice[];     // 従来の分岐用選択肢（下位互換性のため残す）
  quiz?: Quiz;            // 新しいクイズ機能
  nextScene?: string;     // 次のシーンへの直接リンク（一本道ストーリー用）
  sceneImageUrl?: string;
  sceneSpeechUrls?: string[]; // 音声ファイルのURL
  sceneBgmType?: string;   // BGMファイルのタイプ
  useGeneratedImage?: boolean;
  learningPoint?: LearningPoint;
}

export interface Options {
  difficulty?: '簡単' | '通常' | '難しい';
  length?: '短い' | '中' | '長い';
  category?: string;
  tags?: string[];
}

export interface Creator {
  userId?: string;
  username?: string;
}

export interface Metadata {
  creator: Creator;
  createdAt?: Date;
  updatedAt?: Date;
  visibility?: 'public' | 'private' | 'unlisted';
  category?: string;
  tags?: string[];
  difficulty?: string;
}

export interface Story {
  id?: string;
  title: string;
  description: string;
  initialScene: string;
  scenes: Scene[];
  thumbnailURL?: string;
  metadata?: Metadata;
  isQuizMode?: boolean;   // クイズモードかどうかのフラグ
}

/**
 * 空のストーリーデータを作成する
 */
export function createEmptyStoryData(): Story {
  return {
    title: '',
    description: '',
    initialScene: 'start',
    scenes: [],
    thumbnailURL: '',
    metadata: {
      creator: {
        userId: '',
        username: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: 'private',
      category: '',
      tags: [],
      difficulty: '通常',
    },
    isQuizMode: false,
  };
}

enum sceneBgmCategory {
  NONE = 'none',
  AST_DAILY = 'ast_daily',
  CALM_DOWN = 'calm_down',
  CAFE = 'cafe',
  FOREIGN_LAND = 'foreign_land',
  DESERTED_TOWN = 'deserted_town',
  FANTASY = 'fantasy',
  EIGHT_BIT = '8bit',
  TUTORIAL = 'tutorial'
}

export function isSceneBgmCategory(value: string): value is sceneBgmCategory {
  return Object.values(sceneBgmCategory).includes(value as sceneBgmCategory);
}