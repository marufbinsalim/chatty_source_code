// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AES } from "@/utils/Aes/core";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let test = AES.encrypt("hello", "password", 256);
  console.log(test);
  test = AES.decrypt(test, "password2", 256);
  console.log(test);
  res.status(200).json({ status: "The API v.0.1 is running!" });
}
