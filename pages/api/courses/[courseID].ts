import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../scraper/src/mongodb";
import { Course, ICourse } from "../../../scraper/src/models/course";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    await connectToDatabase();
    const { courseID } = req.query;

    // courseID may be undefined, a string, or an array of strings
    if (!courseID) throw "CourseID not provided";
    const idString: string = typeof courseID === "object" ? courseID[0] : courseID;
    const code = idString.replace("-", " ");

    const courses: ICourse[] = await Course.find({
      /* Hacky Type Fix */
      code: { $regex: code, $options: "i" } as unknown as string,
    });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).send(err);
  }
}

export default getCourses;
