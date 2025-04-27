// Firebaseを使ったストーリー関連の操作
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { Story } from './storyModel';

/**
 * 新しいストーリーをFirestoreに保存する
 * @param story 保存するストーリーデータ
 * @param userId ユーザーID
 * @returns 保存されたストーリーのID
 */
export async function saveStory(story: Story, userId: string) {
  try {
    // メタデータを設定
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

/**
 * ユーザーのストーリー一覧を取得する
 * @param userId ユーザーID
 * @returns ストーリーの配列
 */
export async function getUserStories(userId: string) {
  try {
    const q = query(
      collection(db, 'stories'),
      where('metadata.creator.userId', '==', userId),
      orderBy('metadata.createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user stories:', error);
    throw new Error('ストーリー一覧の取得に失敗しました');
  }
}

/**
 * 特定のストーリーを取得する
 * @param storyId ストーリーID
 * @returns ストーリーデータ
 */
export async function getStory(storyId: string) {
  try {
    const storyDoc = await getDoc(doc(db, 'stories', storyId));
    
    if (!storyDoc.exists()) {
      throw new Error('ストーリーが見つかりません');
    }
    
    return {
      id: storyDoc.id,
      ...storyDoc.data()
    };
  } catch (error) {
    console.error('Error getting story:', error);
    throw new Error('ストーリーの取得に失敗しました');
  }
}

/**
 * ストーリーを更新する
 * @param storyId ストーリーID
 * @param updatedData 更新するデータ
 */
export async function updateStory(storyId: string, updatedData: Partial<Story>) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    
    await updateDoc(storyRef, {
      ...updatedData,
      'metadata.updatedAt': serverTimestamp()
    });
    
    return { id: storyId, ...updatedData };
  } catch (error) {
    console.error('Error updating story:', error);
    throw new Error('ストーリーの更新に失敗しました');
  }
}

/**
 * ストーリーを削除する
 * @param storyId ストーリーID
 */
export async function deleteStory(storyId: string) {
  try {
    await deleteDoc(doc(db, 'stories', storyId));
    return true;
  } catch (error) {
    console.error('Error deleting story:', error);
    throw new Error('ストーリーの削除に失敗しました');
  }
}

/**
 * 公開されたストーリーを取得する
 * @param limit 取得する件数
 * @returns 公開ストーリーの配列
 */
export async function getPublicStories(limitCount = 10) {
  try {
    const q = query(
      collection(db, 'stories'),
      where('metadata.visibility', '==', 'public'),
      orderBy('metadata.createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting public stories:', error);
    throw new Error('公開ストーリー一覧の取得に失敗しました');
  }
}
