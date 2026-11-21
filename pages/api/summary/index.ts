import type { NextApiRequest, NextApiResponse } from "next";
import { sendServerError } from "../../../lib/sendServerError";
import { getSummary } from "../../../lib/summaries";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const summaryJson = await getSummary();
    res.status(200).json(summaryJson);
  } catch (err) {
    sendServerError(res, err);
  }
}

export default handler;
