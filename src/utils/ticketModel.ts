/**
 * チケットとポイントの管理に関するモデル
 */

// チケットの型定義
export interface Ticket {
  userId: string;         // ユーザーID
  remainingCount: number; // 残りチケット数
  lastRefillDate: Date;   // 最終チケット補充日
}

// ポイント履歴のステータス
export enum PointTransactionType {
  EARN = 'earn',   // 獲得
  USE = 'use',     // 使用
  REFUND = 'refund', // 返金
  EXPIRE = 'expire'  // 有効期限切れ
}

// ポイント取引履歴
export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: PointTransactionType;
  description: string;
  createdAt: Date;
}

// ユーザーのポイント情報
export interface UserPoints {
  userId: string;
  totalPoints: number;  // 合計ポイント
  transactions: PointTransaction[]; // 取引履歴
}
