/**
 * ポイントシステムの操作関数を提供するファイル
 */
import { db } from '@/lib/firebase';
import { 
  collection, doc, getDoc, setDoc, updateDoc, 
  increment, serverTimestamp, runTransaction, Timestamp 
} from 'firebase/firestore';
import { 
  PointsTransaction, 
  UserPoints, 
  createInitialUserPoints, 
  createPointsTransaction 
} from './pointsModel';
import { POINTS_PER_STORY } from '@/lib/stripe';

/**
 * ユーザーのポイント情報を取得する
 */
export async function getUserPoints(userId: string): Promise<UserPoints | null> {
  try {
    const userPointsRef = doc(db, 'userPoints', userId);
    const docSnap = await getDoc(userPointsRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        userId,
        lastUpdatedAt: data.lastUpdatedAt?.toDate(),
        lastPointsAddedAt: data.lastPointsAddedAt?.toDate(),
      } as UserPoints;
    }
    
    // ユーザーのポイント情報がまだ存在しない場合、初期データを作成
    const initialData = createInitialUserPoints(userId);
    await setDoc(userPointsRef, {
      ...initialData,
      lastUpdatedAt: serverTimestamp(),
    });
    
    // 初期ポイント付与の記録
    await addPointsTransaction(userId, initialData.totalPoints, 'system', '初回登録ボーナス');
    
    return initialData;
  } catch (error) {
    console.error('Error getting user points:', error);
    return null;
  }
}

/**
 * ポイントの取引を記録する
 */
export async function addPointsTransaction(
  userId: string,
  amount: number,
  type: PointsTransaction['type'],
  description: string,
  relatedStoryId?: string
): Promise<string | null> {
  try {
    const transactionData = createPointsTransaction(
      userId,
      amount,
      type,
      description,
      relatedStoryId
    );
    
    const transactionRef = doc(collection(db, `userPoints/${userId}/transactions`));
    await setDoc(transactionRef, {
      ...transactionData,
      createdAt: serverTimestamp(),
    });
    
    return transactionRef.id;
  } catch (error) {
    console.error('Error adding points transaction:', error);
    return null;
  }
}

/**
 * ユーザーのポイントを更新する
 */
export async function updateUserPoints(
  userId: string,
  amount: number,
  type: PointsTransaction['type'],
  description: string,
  relatedStoryId?: string
): Promise<boolean> {
  try {
    // トランザクションを使用して、ポイント更新とトランザクション記録を一貫して行う
    await runTransaction(db, async (transaction) => {
      const userPointsRef = doc(db, 'userPoints', userId);
      const userPointsDoc = await transaction.get(userPointsRef);
      
      if (!userPointsDoc.exists()) {
        // ユーザーのポイント情報がまだ存在しない場合は初期化
        const initialData = createInitialUserPoints(userId);
        transaction.set(userPointsRef, {
          ...initialData,
          totalPoints: initialData.totalPoints + amount,
          lastUpdatedAt: serverTimestamp(),
        });
      } else {
        // 既存のポイント情報を更新
        transaction.update(userPointsRef, {
          totalPoints: increment(amount),
          lastUpdatedAt: serverTimestamp(),
        });
      }
      
      // ポイント取引の記録
      const transactionRef = doc(collection(db, `userPoints/${userId}/transactions`));
      transaction.set(transactionRef, {
        userId,
        amount,
        type,
        description,
        createdAt: serverTimestamp(),
        relatedStoryId,
      });
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user points:', error);
    return false;
  }
}

/**
 * ストーリー生成のためのポイントを消費する
 * ポイントが不足している場合はfalseを返す
 */
export async function consumePointsForStoryGeneration(
  userId: string,
  storyId: string
): Promise<boolean> {
  try {
    let success = false;
    
    // トランザクションを使用して、ポイント消費とトランザクション記録を一貫して行う
    await runTransaction(db, async (transaction) => {
      const userPointsRef = doc(db, 'userPoints', userId);
      const userPointsDoc = await transaction.get(userPointsRef);
      
      if (!userPointsDoc.exists()) {
        throw new Error('User points not found');
      }
      
      const userData = userPointsDoc.data() as UserPoints;
      
      // ポイントが不足している場合はエラー
      if (userData.totalPoints < POINTS_PER_STORY) {
        throw new Error('Insufficient points');
      }
      
      // ポイントを消費
      transaction.update(userPointsRef, {
        totalPoints: increment(-POINTS_PER_STORY),
        lastUpdatedAt: serverTimestamp(),
      });
      
      // ポイント消費の記録
      const transactionRef = doc(collection(db, `userPoints/${userId}/transactions`));
      transaction.set(transactionRef, {
        userId,
        amount: -POINTS_PER_STORY,
        type: 'story_generation',
        description: 'ストーリー生成',
        createdAt: serverTimestamp(),
        relatedStoryId: storyId,
      });
      
      success = true;
    });
    
    return success;
  } catch (error) {
    console.error('Error consuming points for story generation:', error);
    return false;
  }
}

/**
 * ユーザーの課金情報を更新する
 */
export async function updateUserSubscription(
  userId: string,
  subscriptionStatus: UserPoints['subscriptionStatus'],
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<boolean> {
  try {
    const userPointsRef = doc(db, 'userPoints', userId);
    
    await updateDoc(userPointsRef, {
      subscriptionStatus,
      isPremium: subscriptionStatus === 'active' || subscriptionStatus === 'trialing',
      stripeCustomerId: stripeCustomerId || null,
      stripeSubscriptionId: stripeSubscriptionId || null,
      lastUpdatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
}
