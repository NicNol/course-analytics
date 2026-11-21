import type { NextApiRequest, NextApiResponse } from "next";
import { sendServerError } from "../../../lib/sendServerError";
import { connectToDatabase } from "../../../scraper/src/mongodb";
import { Summary } from "../../../scraper/src/models/summary";

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

async function getSummary() {
  await connectToDatabase();
  const summary = await Summary.find({}, { _id: false, versionKey: false });
  return summary;
}

export default handler;
export { getSummary };
