import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../util/mongodb";
import CourseScema from "../../../util/models/course";
import {} from "../../../util/sheets";

type Data = {
    name: string;
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(200).json({ name: "John Doe" });
}

//export default connectDB(handler);
export default handler;
