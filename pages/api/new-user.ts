import createApiClient from "@/utils/supabase/api";
import { clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ result: null, error: "Unauthorized" });
  }
  const user = await (await clerkClient()).users.getUser(userId);
  if (!user) {
    return res.status(404).json({ result: null, error: "User not found" });
  }

  const database = createApiClient(req, res);
  const { error } = await database.from("users").upsert([
    {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      username: user.fullName,
    },
  ]);
  if (error) {
    console.error("Error upserting user:", error);
  }

  let redirectTo = "/";
  res.redirect(redirectTo);
}
