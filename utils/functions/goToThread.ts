import { createClient } from "../supabase/client";

async function goToThread(user_1_id: string, user_2_id: string) {
  const database = createClient();
  const { data, error } = await database
    .from("threads")
    .select("*")
    .eq("user_1_id", user_1_id)
    .eq("user_2_id", user_2_id)
    .single();

  if (data) return data.thread_id;

  const { data: reverseData, error: reverseError } = await database
    .from("threads")
    .select("*")
    .eq("user_1_id", user_2_id)
    .eq("user_2_id", user_1_id)
    .single();

  if (reverseData) return reverseData.thread_id;

  const { data: newThread, error: newThreadError } = await database
    .from("threads")
    .insert([
      {
        user_1_id,
        user_2_id,
      },
    ])
    .select("*")
    .single();

  if (newThreadError) {
    console.error("Error creating new thread:", newThreadError);
    return null;
  }

  return newThread.thread_id;
}

export { goToThread };
