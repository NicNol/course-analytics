import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";
import { Summary } from "../../../util/models/summary";
import summarizeData from "../../../util/summarize";

async function getSummary(req: NextApiRequest, res: NextApiResponse) {
    //await summarizeData();
    if (req.method === "GET") {
        try {
            await connectToDatabase();
            const summary = await Summary.find({});
            res.status(200).json(summary);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

export default getSummary;
