"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Story } from "@/utils/storyModel";

/**
 * ユーザーのストーリー一覧を取得するカスタムフック
 */
export const useStories = () => {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ストーリー一覧を取得する関数
  const fetchStories = useCallback(async () => {
    if (!session) {
      setStories([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch("/api/stories?type=user");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ストーリー取得中にエラーが発生しました");
      }

      const data = await response.json();
      setStories(data.stories || []);
    } catch (err: unknown) {
      console.error("Error fetching stories:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // セッションが変わったら読み込み
  useEffect(() => {
    if (session) {
      fetchStories();
    } else {
      setStories([]);
    }
  }, [fetchStories, session]);

  return {
    stories,
    loading,
    error,
    refreshStories: fetchStories,
  };
};
