import { classList } from "./classList";
import type { ICourse } from "./models/course";

interface ISummary {
  code: string;
  title: string;
  "average difficulty": string;
  "time commitment": string;
  "review count": string;
  tags: string[];
}

interface ISummaryByDate {
  "All Time": ISummary[];
  "Past 2 Years": ISummary[];
  "Past 6 Months": ISummary[];
}

export type { ISummary, ISummaryByDate };

export const timeAvg = new Map([
  ["0-5 hours", 3],
  ["6-12 hours", 9],
  ["13-18 hours", 15],
  ["18+ hours", 21],
]);

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

class SummaryObject {
  code: string;
  title: string;
  difficulty = 0;
  time = 0;
  timeReviews = 0;
  reviews = 0;
  tags: [] | string[] = [];

  constructor(code: string, title: string) {
    this.code = code;
    this.title = title;
    this.tags = classList.find((classObj) => classObj.code === code)?.tags || [];
  }
}

export function summarizeByDate(reviews: ICourse[], now: Date): ISummaryByDate {
  return {
    "All Time": summarizeSince(reviews, now, 99999),
    "Past 2 Years": summarizeSince(reviews, now, 730),
    "Past 6 Months": summarizeSince(reviews, now, 183),
  };
}

function summarizeSince(reviews: ICourse[], now: Date, daysInPast: number): ISummary[] {
  const courseSummaries = new Map<string, SummaryObject>();
  const summaryJSON: ISummary[] = [];

  for (const course of reviews) {
    const { difficulty, code, title, "time commitment": time, "review date": reviewDate } = course;
    if (!code || !title) continue;

    let summary = courseSummaries.get(code);
    if (!summary) {
      summary = new SummaryObject(code, title);
      courseSummaries.set(code, summary);
    }

    if (Date.parse(reviewDate) <= now.getTime() - daysInPast * MILLISECONDS_PER_DAY) continue;

    summary.reviews += 1;
    summary.difficulty += parseInt(difficulty);
    const hours = timeAvg.get(time);
    if (hours !== undefined) {
      summary.time += hours;
      summary.timeReviews += 1;
    }
  }

  for (const { difficulty, code, title, reviews, tags, time, timeReviews } of courseSummaries.values()) {
    const avgDifficulty = Math.round((difficulty / reviews) * 10) / 10 || 0;
    const timeCommitment = Math.round(time / timeReviews) || 0;

    summaryJSON.push({
      code: code,
      title: title,
      "average difficulty": avgDifficulty.toString(),
      "time commitment": timeCommitment.toString(),
      "review count": reviews.toString(),
      tags: tags,
    });
  }

  return summaryJSON;
}
