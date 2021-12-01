import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";
import { Summary } from "../../../util/models/summary";

async function getSummary(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            await connectToDatabase();
            const summary = await Summary.find(
                {},
                { _id: false, versionKey: false }
            );
            res.status(200).json(summary);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

export default getSummary;
