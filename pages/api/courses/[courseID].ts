import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../util/mongodb";
import CourseScema from "../../../util/models/course";
import getDocuments from "../../../util/sheets";

type Data = {
    name: string;
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    getDocuments();
    res.status(200).json({ name: "John Doe" });
}

//export default connectDB(handler);
export default handler;
