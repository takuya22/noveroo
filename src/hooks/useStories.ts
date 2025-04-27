"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * ユーザーのストーリー一覧を取得するカスタムフック
 */
export const useStories = () => {
  const { data: session } = useSession();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ストーリー一覧を取得する関数
  const fetchStories = async () => {
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
  };

  // セッションが変わったら読み込み
  useEffect(() => {
    if (session) {
      fetchStories();
    } else {
      setStories([]);
    }
  }, [session]);

  return {
    stories,
    loading,
    error,
    refreshStories: fetchStories,
  };
};
