import { connectToDatabase } from "./mongodb";
import { Course } from "./models/course";
import { escapeRegExp } from "./escapeRegExp";

async function findCourses(codeSearchText: string) {
  await connectToDatabase();
  const courseData = await Course.find(
    { code: { $regex: escapeRegExp(codeSearchText), $options: "i" } },
    { _id: false, versionKey: false },
  );
  return courseData;
}

export async function getAllCourseData() {
  return findCourses("");
}

export async function getCourseData(courseCode: string) {
  if (!courseCode.trim()) throw new Error("A course code is required");
  return findCourses(courseCode);
}
