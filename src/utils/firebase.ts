// Firebase関連のユーティリティ関数
import { doc, collection, addDoc, updateDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Story } from './storyModel';

/**
 * ストーリーをFirestoreに保存する
 * @param userId ユーザーID
 * @param story ストーリーデータ
 * @returns 保存されたストーリーのドキュメントID
 */
export async function saveStoryToFirestore(userId: string, story: Story): Promise<string> {
  try {
    // メタデータを準備
    const storyWithMetadata = {
      ...story,
      metadata: {
        ...story.metadata,
        creator: {
          userId,
          username: story.metadata?.creator?.username || '',
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    };

    // Firestoreに保存
    const storiesRef = collection(db, 'stories');
    const docRef = await addDoc(storiesRef, storyWithMetadata);
    
    console.log('Story saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving story to Firestore:', error);
    throw new Error('ストーリーの保存に失敗しました');
  }
}

/**
 * ストーリーを更新する
 * @param storyId ストーリーID
 * @param storyData 更新するストーリーデータ
 */
export async function updateStory(storyId: string, storyData: Partial<Story>): Promise<void> {
  try {
    const storyRef = doc(db, 'stories', storyId);
    
    // 更新データを準備（タイムスタンプを追加）
    const updateData = {
      ...storyData,
      'metadata.updatedAt': serverTimestamp()
    };
    
    await updateDoc(storyRef, updateData);
    console.log('Story updated:', storyId);
  } catch (error) {
    console.error('Error updating story:', error);
    throw new Error('ストーリーの更新に失敗しました');
  }
}

/**
 * Base64画像データをFirebase Storageにアップロードする
 * @param base64Data Base64エンコードされた画像データ
 * @param folderPath 保存先フォルダパス
 * @param fileName ファイル名
 * @returns アップロードされた画像のURL
 */
export async function uploadImageToStorage(base64Data: string, folderPath: string, fileName: string): Promise<string> {
  try {
    // Base64データからデータURIスキームを削除（あれば）
    const base64Content = base64Data.includes('base64,') 
      ? base64Data.split('base64,')[1]
      : base64Data;
    
    // ファイル名に日時を追加して一意にする
    const timestamp = new Date().getTime();
    const uniqueFileName = `${fileName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.jpg`;
    
    // Storage参照を作成
    const storageRef = ref(storage, `${folderPath}/${uniqueFileName}`);
    
    // Base64データをアップロード
    await uploadString(storageRef, base64Content, 'base64');
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Image uploaded, URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    throw new Error('画像のアップロードに失敗しました');
  }
}

/**
 * 生のバイナリデータをFirebase Storageにアップロードする
 * @param buffer ArrayBufferのバイナリデータ
 * @param folderPath 保存先フォルダパス
 * @param fileName ファイル名
 * @param contentType MIMEタイプ（オプション）
 * @returns アップロードされた画像のURL
 */
export async function uploadBufferToStorage(
  buffer: ArrayBuffer,
  folderPath: string,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    // ファイル名に日時を追加して一意にする
    const timestamp = new Date().getTime();
    const uniqueFileName = `${fileName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}`;
    const extension = contentType.split('/')[1] || 'jpg';
    
    // Storage参照を作成
    const storageRef = ref(storage, `${folderPath}/${uniqueFileName}.${extension}`);
    
    // バイナリデータをアップロード
    await uploadBytes(storageRef, buffer, { contentType });
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Binary data uploaded, URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading binary to storage:', error);
    throw new Error('ファイルのアップロードに失敗しました');
  }
}

/**
 * ユーザーのストーリー一覧を取得する
 * @param userId ユーザーID
 * @param limitCount 取得する最大件数（オプション）
 * @returns ストーリーの配列
 */
export async function getUserStories(userId: string, limitCount: number = 20): Promise<Array<Story & { id: string }>> {
  try {
    const storiesRef = collection(db, 'stories');
    const q = query(
      storiesRef,
      where('metadata.creator.userId', '==', userId),
      orderBy('metadata.createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const stories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Story & { id: string }));
    
    return stories;
  } catch (error) {
    console.error('Error getting user stories:', error);
    throw new Error('ストーリー一覧の取得に失敗しました');
  }
}
