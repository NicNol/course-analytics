import type { NextApiResponse } from "next";

export function sendServerError(res: NextApiResponse, err: unknown) {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
