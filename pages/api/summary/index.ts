import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";
import { Course } from "../../../util/models/course";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            await connectToDatabase();
            const { courseID } = req.query;
            const courses = await Course.find({
                name: { $regex: courseID, $options: "i" },
            });
            res.status(200).json(courses);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

export default getCourses;
