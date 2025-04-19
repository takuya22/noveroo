import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

// サブスクリプションのプラン情報
export const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_SUBSCRIPTION_PRICE_ID || '';
export const FREE_POINTS_PER_MONTH = 3; // 無料ユーザーに毎月付与するポイント数
export const PREMIUM_POINTS_PER_MONTH = 2000; // 有料ユーザーに毎月付与するポイント数
export const POINTS_PER_STORY = 100; // 1ストーリー生成あたりの消費ポイント数
