/**
 * ポイントシステムのデータモデルを定義するファイル
 */

export interface PointsTransaction {
  id?: string;
  userId: string;
  amount: number; // 正の値は追加、負の値は消費
  type: 'subscription' | 'story_generation' | 'admin' | 'system';
  description: string;
  createdAt: Date;
  relatedStoryId?: string; // ストーリー生成の場合に関連するストーリーID
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  lastUpdatedAt: Date;
  subscriptionStatus?: 'active' | 'inactive' | 'canceled' | 'trialing' | 'none';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  isPremium: boolean;
  lastPointsAddedAt?: Date;
}

/**
 * ユーザーのポイント情報の初期データを作成
 */
export function createInitialUserPoints(userId: string): UserPoints {
  return {
    userId,
    totalPoints: 5, // 初回登録時の無料ポイント
    lastUpdatedAt: new Date(),
    subscriptionStatus: 'none',
    isPremium: false,
  };
}

/**
 * ポイント取引記録の作成
 */
export function createPointsTransaction(
  userId: string,
  amount: number,
  type: PointsTransaction['type'],
  description: string,
  relatedStoryId?: string
): PointsTransaction {
  return {
    userId,
    amount,
    type,
    description,
    createdAt: new Date(),
    relatedStoryId,
  };
}
