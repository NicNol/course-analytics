import type { NextApiRequest, NextApiResponse } from "next";
import { getCourseData } from "../../../lib/courses";
import { sendServerError } from "../../../lib/sendServerError";
import { PUBLIC_API_CACHE_CONTROL } from "../../../lib/publicApiCache";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const { courseID } = req.query;

    // courseID may be undefined, a string, or an array of strings
    const idString = Array.isArray(courseID) ? courseID[0] : courseID;
    if (!idString?.trim()) {
      res.status(400).json({ error: "CourseID not provided" });
      return;
    }
    const code = idString.replace("-", " ");

    const courses = await getCourseData(code);
    res.setHeader("Cache-Control", PUBLIC_API_CACHE_CONTROL);
    res.status(200).json(courses);
  } catch (err) {
    sendServerError(res, err);
  }
}

export default getCourses;
