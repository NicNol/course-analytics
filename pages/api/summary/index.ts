import type { NextApiRequest, NextApiResponse } from "next";
import { sendServerError } from "../../../lib/sendServerError";
import { PUBLIC_API_CACHE_CONTROL } from "../../../lib/publicApiCache";
import { getSummary } from "../../../lib/summaries";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const summaryJson = await getSummary();
    res.setHeader("Cache-Control", PUBLIC_API_CACHE_CONTROL);
    res.status(200).json(summaryJson);
  } catch (err) {
    sendServerError(res, err);
  }
}

export default handler;
