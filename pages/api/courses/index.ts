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

async function getCourseData(courseid = "") {
    await connectToDatabase();
    const courseData = await Course.find(
        { name: { $regex: courseid, $options: "i" } as unknown as string },
        { _id: false, versionKey: false }
    );
    return courseData;
}

export default getCourses;
export { getCourseData };
