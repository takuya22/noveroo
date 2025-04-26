/**
 * チケット管理のためのサービス
 */
import { db } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, query, where, getDocs } from 'firebase/firestore';
import { Ticket } from './ticketModel';

// 1日あたりのチケット補充数（無料ユーザー）
const DAILY_TICKET_REFILL = 5;

/**
 * ユーザーのチケット情報を取得する
 * @param userId ユーザーID
 * @returns チケット情報
 */
export async function getUserTickets(userId: string): Promise<Ticket> {
  try {
    const ticketRef = doc(db, 'tickets', userId);
    const ticketSnap = await getDoc(ticketRef);
    
    if (ticketSnap.exists()) {
      return ticketSnap.data() as Ticket;
    } else {
      // チケット情報がなければ初期値を作成
      const newTicket: Ticket = {
        userId,
        remainingCount: DAILY_TICKET_REFILL, // 初期値は5チケット
        lastRefillDate: new Date()
      };
      
      // Firestoreに保存
      await setDoc(ticketRef, newTicket);
      return newTicket;
    }
  } catch (error) {
    console.error('Error getting user tickets:', error);
    throw new Error('チケット情報の取得に失敗しました');
  }
}

/**
 * チケットの自動補充をチェック（1日ごとに5チケット）
 * @param userId ユーザーID
 * @returns 補充後のチケット情報
 */
export async function checkAndRefillTickets(userId: string): Promise<Ticket> {
  try {
    const ticketRef = doc(db, 'tickets', userId);
    const ticket = await getUserTickets(userId);
    
    const now = new Date();
    const lastRefill = new Date(ticket.lastRefillDate);
    
    // 最終補充日と現在の日付の日付部分を比較
    const isSameDay = lastRefill.getDate() === now.getDate() &&
                     lastRefill.getMonth() === now.getMonth() &&
                     lastRefill.getFullYear() === now.getFullYear();
    
    // 同じ日でなければチケット補充
    if (!isSameDay) {
      const updatedTicket: Ticket = {
        ...ticket,
        remainingCount: DAILY_TICKET_REFILL, // 毎日5チケットにリセット
        lastRefillDate: now
      };
      
      await setDoc(ticketRef, updatedTicket);
      return updatedTicket;
    }
    
    return ticket;
  } catch (error) {
    console.error('Error checking ticket refill:', error);
    throw new Error('チケットの補充処理に失敗しました');
  }
}

/**
 * チケットを使用する
 * @param userId ユーザーID
 * @returns 残りチケット数
 */
export async function consumeTicket(userId: string): Promise<number> {
  try {
    // まず補充チェック
    const ticket = await checkAndRefillTickets(userId);
    
    if (ticket.remainingCount <= 0) {
      throw new Error('チケットが不足しています');
    }
    
    // チケットを1枚消費
    const ticketRef = doc(db, 'tickets', userId);
    await updateDoc(ticketRef, {
      remainingCount: increment(-1)
    });
    
    return ticket.remainingCount - 1;
  } catch (error) {
    console.error('Error using ticket:', error);
    throw error;
  }
}

// 後方互換性のためのエイリアス
export const useTicket = consumeTicket;

/**
 * 現在のチケット残数を確認する
 * @param userId ユーザーID
 * @returns 残りチケット数
 */
export async function getTicketCount(userId: string): Promise<number> {
  const ticket = await checkAndRefillTickets(userId);
  return ticket.remainingCount;
}

/**
 * チケットを追加する管理者用関数
 * @param userId ユーザーID
 * @param count 追加チケット数
 * @returns 追加後の残りチケット数
 */
export async function addTickets(userId: string, count: number): Promise<number> {
  try {
    const ticket = await getUserTickets(userId);
    const ticketRef = doc(db, 'tickets', userId);
    
    await updateDoc(ticketRef, {
      remainingCount: increment(count)
    });
    
    return ticket.remainingCount + count;
  } catch (error) {
    console.error('Error adding tickets:', error);
    throw new Error('チケットの追加に失敗しました');
  }
}
