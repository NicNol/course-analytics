import updateDB from "../../scraper/src/scheduler/updateDB";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP METHOD NOT ACCEPTED");
    return;
  }
  if (req.headers.authorization !== process.env.CRON_KEY) {
    res.status(401).end("UNAUTHORIZED");
    return;
  }

  try {
    await updateDB();
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    res.status(500).send(err);
  }
}

export default handler;
