import type { NextApiRequest, NextApiResponse } from "next";
import { getAllCourseData } from "../../../lib/courses";
import { sendServerError } from "../../../lib/sendServerError";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const courses = await getAllCourseData();
    res.status(200).json(courses);
  } catch (err) {
    sendServerError(res, err);
  }
}

export default getCourses;
