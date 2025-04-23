import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export default function useUsers(
  searchTerm: string,
  id: string | null | undefined,
) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const database = createClient();
      const { data, error } = await database
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      console.log("Fetched users:", data, error);
      if (error) {
        console.error("Error fetching users:", error);
      }
      setUsers((data as User[]) || []);
      setIsLoaded(true);
    };

    fetchUsers();
  }, []);

  return {
    users:
      users?.filter(
        (user) =>
          (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
          user.id !== id,
      ) || [],
    isLoaded,
    error: null, // Replace with actual error handling if needed
  };
}
