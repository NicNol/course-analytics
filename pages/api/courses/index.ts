import type { NextApiRequest, NextApiResponse } from "next";
import { getReviews } from "../../../lib/survey";
import { sendServerError } from "../../../lib/sendServerError";
import { PUBLIC_API_CACHE_CONTROL } from "../../../lib/publicApiCache";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const courses = await getReviews();
    res.setHeader("Cache-Control", PUBLIC_API_CACHE_CONTROL);
    res.status(200).json(courses);
  } catch (err) {
    sendServerError(res, err);
  }
}

export default getCourses;
