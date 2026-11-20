import { classList } from "../../scraper/src/classList";
import updateDB from "../../scraper/src/scheduler/updateDB";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP METHOD NOT ACCEPTED");
    return;
  }
  const cronKey = process.env.CRON_KEY;
  if (!cronKey || req.headers.authorization !== cronKey) {
    res.status(401).end("UNAUTHORIZED");
    return;
  }

  try {
    await updateDB();
    const coursePaths = classList.map((course) => `/courses/${course.code.replace(" ", "-")}`);
    await Promise.all(["/", ...coursePaths].map((path) => res.revalidate(path)));
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    res.status(500).send(err);
  }
}

export default handler;
