import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../scraper/src/mongodb";
import { Summary } from "../../../scraper/src/models/summary";
import type { ISummary } from "../../../scraper/src/models/summary";

const DATE_RANGES = ["All Time", "Past 2 Years", "Past 6 Months"] as const;

async function getSummary(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    await connectToDatabase();

    const { courseID } = req.query;
    if (!courseID) throw "CourseID not provided";
    const idString: string = typeof courseID === "object" ? courseID[0] : courseID;
    const code = idString.replace("-", " ").toLowerCase();

    const summaries = await Summary.find({}, { _id: false, versionKey: false });

    const filtered = summaries.map((summary) => {
      const result: Record<string, ISummary[]> = {};
      for (const range of DATE_RANGES) {
        const rows: ISummary[] = summary[range] ?? [];
        result[range] = rows.filter((row) => row.code.toLowerCase().includes(code));
      }
      return result;
    });

    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).send(err);
  }
}

export default getSummary;
