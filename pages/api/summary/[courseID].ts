import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../scraper/src/mongodb";
import { Summary } from "../../../scraper/src/models/summary";

async function getSummary(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    connectToDatabase();

    const { courseID } = req.query;
    const summary = await Summary.find(
      {
        name: { $regex: courseID, $options: "i" },
      } as any,
      { _id: false, versionKey: false }
    );
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).send(err);
  }
}

export default getSummary;
