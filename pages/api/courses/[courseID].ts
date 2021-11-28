import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../util/mongodb";
import { CourseSchema } from "../../../util/models/course";
import { prepareSheet, getJSON } from "../../../util/sheets";

// type Data = {
//     name: string;
// };

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<CourseSchema>>
) {
    await prepareSheet();
    const data = await getJSON();
    res.status(200).json(data);
}

//export default connectDB(handler);
export default handler;
