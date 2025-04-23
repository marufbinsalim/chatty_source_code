// hooks/useMessageHistory.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { AES } from "@/utils/Aes/core";

interface Thread {
  thread_id: string;
  user_1_id: string;
  user_2_id: string;
  last_message: string;
  created_at: string;
  other_user?: {
    id: string;
    username: string;
    email: string;
  };
}

export default function useMessageHistory() {
  const supabase = createClient();
  const { user } = useUser();
  const [history, setHistory] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMessageHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all threads where the current user is either user_1 or user_2
        const { data: threadsData, error: threadsError } = await supabase
          .from("threads")
          .select("*")
          .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (threadsError) throw threadsError;

        // Fetch details of the other user in each thread
        const threadsWithUsers = await Promise.all(
          threadsData.map(async (thread) => {
            const otherUserId =
              thread.user_1_id === user.id
                ? thread.user_2_id
                : thread.user_1_id;

            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("id, username, email")
              .eq("id", otherUserId)
              .single();

            if (userError) console.error("Error fetching user:", userError);

            return {
              ...thread,
              other_user: userData || null,
            };
          }),
        );

        setHistory(threadsWithUsers);
      } catch (err) {
        console.error("Error fetching message history:", err);
        setError("Failed to load message history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessageHistory();

    // Set up real-time subscription for thread updates
    const channel = supabase
      .channel("thread_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "threads",
          filter: `user_1_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle thread updates for user_1
          handleThreadUpdate(payload);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "threads",
          filter: `user_2_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle thread updates for user_2
          handleThreadUpdate(payload);
        },
      )
      .subscribe();

    const handleThreadUpdate = async (payload: any) => {
      const updatedThread = payload.new;
      const otherUserId =
        updatedThread.user_1_id === user.id
          ? updatedThread.user_2_id
          : updatedThread.user_1_id;

      const { data: userData } = await supabase
        .from("users")
        .select("id, username, email")
        .eq("id", otherUserId)
        .single();

      setHistory((prev) => {
        const existingIndex = prev.findIndex(
          (t) => t.thread_id === updatedThread.thread_id,
        );

        const updatedThreadWithUser = {
          ...updatedThread,
          other_user: userData || null,
        };

        if (existingIndex >= 0) {
          // Update existing thread
          const newHistory = [...prev];
          newHistory[existingIndex] = updatedThreadWithUser;
          return newHistory;
        } else {
          // Add new thread
          return [updatedThreadWithUser, ...prev];
        }
      });
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  return {
    history: history.map((thread) => ({
      ...thread,
      last_message: thread.last_message
        ? AES.decrypt(
            thread.last_message,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            256,
          )
        : "No messages yet",
    })),
    isLoading,
    error,
    formatTime,
  };
}
