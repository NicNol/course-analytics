import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../scraper/src/mongodb";
import { Course } from "../../../scraper/src/models/course";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const courses = await getCourseData();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function getCourseData(courseCode = "") {
  connectToDatabase();
  const courseData = await Course.find(
    { code: { $regex: courseCode, $options: "i" } },
    { _id: false, versionKey: false }
  );
  return courseData;
}

export default getCourses;
export { getCourseData };
