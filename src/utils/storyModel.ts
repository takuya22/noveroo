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

export interface Choice {
  text: string;
  nextScene: string;
}

export interface LearningPoint {
  sceneId: string;
  title: string;
  content: string;
}

export interface Scene {
  id: string;
  type: string;
  background: string;
  characters?: Character[];
  text: string;
  text_en: string;
  choices?: Choice[];
  sceneImageUrl?: string;
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
  title: string;
  description: string;
  initialScene: string;
  scenes: Scene[];
  thumbnailURL?: string;
  metadata?: Metadata;
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
  };
}
