import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";
import { Course } from "../../../util/models/course";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const courses = await getCourseData();
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).send(err);
    }
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
