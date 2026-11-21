import type { NextApiRequest, NextApiResponse } from "next";
import { sendServerError } from "../../../lib/sendServerError";
import { getSummary } from "../../../lib/summaries";
import type { ISummary } from "../../../lib/models/summary";

const DATE_RANGES = ["All Time", "Past 2 Years", "Past 6 Months"] as const;

async function getCourseSummary(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end("HTTP method not accepted");
    return;
  }
  try {
    const { courseID } = req.query;
    const idString = Array.isArray(courseID) ? courseID[0] : courseID;
    if (!idString) {
      res.status(400).json({ error: "CourseID not provided" });
      return;
    }
    const code = idString.replace("-", " ").toLowerCase();

    const summaries = await getSummary();

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
    sendServerError(res, err);
  }
}

export default getCourseSummary;
