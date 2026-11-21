import { classList } from "../../lib/classList";
import updateDB from "../../scraper/updateDB";
import { readEnv } from "../../lib/env";
import { isValidCronKey } from "../../lib/isValidCronKey";
import { sendServerError } from "../../lib/sendServerError";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP METHOD NOT ACCEPTED");
    return;
  }
  if (!isValidCronKey(req.headers.authorization, readEnv("CRON_KEY"))) {
    res.status(401).end("UNAUTHORIZED");
    return;
  }

  try {
    await updateDB();
    const coursePaths = classList.map((course) => `/courses/${course.code.replace(" ", "-")}`);
    await Promise.all(["/", ...coursePaths].map((path) => res.revalidate(path)));
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    sendServerError(res, err);
  }
}

export default handler;
