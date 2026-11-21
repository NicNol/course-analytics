import { connectToDatabase } from "../scraper/src/mongodb";
import { Course } from "../scraper/src/models/course";
import { escapeRegExp } from "./escapeRegExp";

export async function getCourseData(courseCode = "") {
  await connectToDatabase();
  const courseData = await Course.find(
    { code: { $regex: escapeRegExp(courseCode), $options: "i" } },
    { _id: false, versionKey: false },
  );
  return courseData;
}
