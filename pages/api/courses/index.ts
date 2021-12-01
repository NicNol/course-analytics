import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";
import { Course } from "../../../util/models/course";

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            await connectToDatabase();
            const courses = await Course.find({});
            res.status(200).json(courses);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

export default getCourses;
