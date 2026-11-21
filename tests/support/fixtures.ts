import type { ICourse } from "../../lib/reviews";
import type { ISummary } from "../../lib/summarize";

export function buildReview(overrides: Partial<ICourse> = {}): ICourse {
  return {
    code: "CS 161",
    title: "Introduction to Computer Science I",
    difficulty: "2",
    "time commitment": "6-12 hours",
    review: "Start the assignments early.",
    "review date": "6/1/2026 10:00:00",
    quarter: "SP 2026",
    "other courses": [],
    ...overrides,
  };
}

export function buildSummaryRow(overrides: Partial<ISummary> = {}): ISummary {
  return {
    code: "CS 161",
    title: "Introduction to Computer Science I",
    "average difficulty": "2.5",
    "time commitment": "9",
    "review count": "120",
    tags: ["Lower Division", "Core Class"],
    ...overrides,
  };
}

export function buildMonthlyReviews(count: number) {
  return [...Array(count).keys()].map((index) =>
    buildReview({
      code: "CS 374",
      review: `Review number ${index + 1}`,
      "review date": `${index + 1}/15/2025 10:00:00`,
    }),
  );
}
