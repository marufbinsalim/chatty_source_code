// hooks/useMessenger.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { AES } from "@/utils/Aes/core";

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
}

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

export default function useMessenger(threadId: string | null) {
  const supabase = createClient();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages for the current thread
  useEffect(() => {
    if (!threadId || !user?.id) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Fetch sender details for each message
        const messagesWithUsers = await Promise.all(
          data.map(async (message) => {
            const { data: senderData } = await supabase
              .from("users")
              .select("username, email")
              .eq("id", message.sender_id)
              .single();

            return {
              ...message,
              user: senderData || null,
            };
          }),
        );

        setMessages(messagesWithUsers);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    };

    fetchMessages();
  }, [threadId, user?.id]);

  // Fetch thread details
  useEffect(() => {
    if (!threadId || !user?.id) return;

    const fetchThread = async () => {
      try {
        const { data, error } = await supabase
          .from("threads")
          .select("*")
          .eq("thread_id", threadId)
          .single();

        if (error) throw error;

        const otherUserId =
          data.user_1_id === user.id ? data.user_2_id : data.user_1_id;

        const { data: userData } = await supabase
          .from("users")
          .select("id, username, email")
          .eq("id", otherUserId)
          .single();

        setThread({
          ...data,
          other_user: userData || null,
        });
      } catch (err) {
        console.error("Error fetching thread:", err);
        setError("Failed to load thread");
      }
    };

    fetchThread();
  }, [threadId, user?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`messages:thread_id=eq.${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;

          // Fetch sender details
          const { data: senderData } = await supabase
            .from("users")
            .select("username, email")
            .eq("id", newMsg.sender_id)
            .single();
          //@ts-ignore
          setMessages((prev) => [
            ...prev,
            {
              ...newMsg,
              user: senderData || null,
            },
          ]);

          // Update last message in thread
          await supabase
            .from("threads")
            .update({ last_message: newMsg.content })
            .eq("thread_id", threadId);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  const sendMessage = async () => {
    console.log("[1] Send button clicked");

    if (!newMessage.trim()) {
      console.log("[2] Message content empty");
      return;
    }

    if (!threadId) {
      console.log("[3] No threadId:", threadId);
      return;
    }

    if (!user?.id) {
      console.log("[4] No user ID:", user);
      return;
    }

    if (isSending) {
      console.log("[5] Already sending");
      return;
    }

    // encrypt the message in this stage

    console.log("[6] All preconditions met, preparing to send");
    let encryptedContent = AES.encrypt(
      newMessage,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      256,
    );
    console.log("[7] Message data:", {
      thread_id: threadId,
      sender_id: user.id,
      content: encryptedContent,
    });

    setIsSending(true);
    setError(null);

    try {
      console.log("[8] Attempting to send message");

      // First get the Supabase user ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error("[9] User lookup failed:", userError);
        throw new Error("User not found in database");
      }

      console.log("[10] Found user in database:", userData.id);

      // Then send the message
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            thread_id: threadId,
            sender_id: userData.id,
            content: encryptedContent,
          },
        ])
        .select();

      if (error) {
        console.error("[11] Message send error:", error);
        throw error;
      }

      console.log("[12] Message sent successfully:", data);
      setNewMessage("");
    } catch (err) {
      console.error("[13] Error in send process:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      console.log("[14] Finalizing send attempt");
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  return {
    messages:
      messages.map((message) => ({
        ...message,
        content: AES.decrypt(
          message.content,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          256,
        ),
      })) || [],
    newMessage,
    setNewMessage,
    thread,
    sendMessage,
    isSending,
    error,
    formatTime,
  };
}
