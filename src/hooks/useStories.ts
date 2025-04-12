"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "./useAuth";

/**
 * ユーザーのストーリー一覧を取得するカスタムフック
 */
export const useStories = () => {
  const { data: session } = useSession();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ストーリー一覧を取得する関数
  const fetchStories = async () => {
    if (!session) {
      setStories([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stories");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ストーリー取得中にエラーが発生しました");
      }

      const data = await response.json();
      setStories(data.stories || []);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError(err.message);
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
