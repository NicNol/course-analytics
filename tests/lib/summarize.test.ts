import { describe, expect, it } from "vitest";
import { summarizeByDate } from "../../lib/summarize";
import { buildReview } from "../support/fixtures";

const NOW = new Date("2026-06-15T12:00:00Z");
const REVIEW_DATE_WITHIN_SIX_MONTHS = "6/1/2026 10:00:00";
const REVIEW_DATE_WITHIN_TWO_YEARS = "6/1/2025 10:00:00";
const REVIEW_DATE_OLDER_THAN_TWO_YEARS = "6/1/2023 10:00:00";

const LOWER_DIVISION_CORE_TAGS = ["Lower Division", "Core Class"];

describe("summarizeByDate", () => {
  it("returns averages for each date range when a course has reviews of different ages", () => {
    const reviews = [
      buildReview({
        difficulty: "5",
        "time commitment": "18+ hours",
        "review date": REVIEW_DATE_OLDER_THAN_TWO_YEARS,
      }),
      buildReview({
        difficulty: "3",
        "time commitment": "6-12 hours",
        "review date": REVIEW_DATE_WITHIN_TWO_YEARS,
      }),
      buildReview({
        difficulty: "1",
        "time commitment": "0-5 hours",
        "review date": REVIEW_DATE_WITHIN_SIX_MONTHS,
      }),
    ];
    const cs161Summary = {
      code: "CS 161",
      title: "Introduction to Computer Science I",
      tags: LOWER_DIVISION_CORE_TAGS,
    };

    const summary = summarizeByDate(reviews, NOW);

    expect(summary["All Time"]).toStrictEqual([
      { ...cs161Summary, "average difficulty": "3", "time commitment": "11", "review count": "3" },
    ]);
    expect(summary["Past 2 Years"]).toStrictEqual([
      { ...cs161Summary, "average difficulty": "2", "time commitment": "6", "review count": "2" },
    ]);
    expect(summary["Past 6 Months"]).toStrictEqual([
      { ...cs161Summary, "average difficulty": "1", "time commitment": "3", "review count": "1" },
    ]);
  });

  it("returns the average difficulty rounded to one decimal", () => {
    const reviews = [
      buildReview({ difficulty: "1" }),
      buildReview({ difficulty: "2" }),
      buildReview({ difficulty: "2" }),
    ];

    const summary = summarizeByDate(reviews, NOW);

    const [courseSummary] = summary["All Time"];
    expect(courseSummary?.["average difficulty"]).toBe("1.7");
  });

  it("returns the time commitment rounded to a whole number of hours", () => {
    const reviews = [
      buildReview({ "time commitment": "0-5 hours" }),
      buildReview({ "time commitment": "0-5 hours" }),
      buildReview({ "time commitment": "0-5 hours" }),
      buildReview({ "time commitment": "6-12 hours" }),
    ];

    const summary = summarizeByDate(reviews, NOW);

    const [courseSummary] = summary["All Time"];
    expect(courseSummary?.["time commitment"]).toBe("5");
  });

  it("returns a zeroed row when the course has no reviews in the date range", () => {
    const reviews = [
      buildReview({
        code: "CS 162",
        title: "Introduction to Computer Science II",
        difficulty: "4",
        "time commitment": "13-18 hours",
        "review date": REVIEW_DATE_OLDER_THAN_TWO_YEARS,
      }),
    ];
    const cs162Summary = {
      code: "CS 162",
      title: "Introduction to Computer Science II",
      tags: LOWER_DIVISION_CORE_TAGS,
    };

    const summary = summarizeByDate(reviews, NOW);

    expect(summary["All Time"]).toStrictEqual([
      { ...cs162Summary, "average difficulty": "4", "time commitment": "15", "review count": "1" },
    ]);
    expect(summary["Past 6 Months"]).toStrictEqual([
      { ...cs162Summary, "average difficulty": "0", "time commitment": "0", "review count": "0" },
    ]);
  });

  it("returns one row per course in the order the courses first appear", () => {
    const reviews = [
      buildReview({ code: "CS 261", title: "Data Structures" }),
      buildReview({ code: "CS 161" }),
      buildReview({ code: "CS 261", title: "Data Structures" }),
    ];

    const summary = summarizeByDate(reviews, NOW);

    const codes = summary["All Time"].map(({ code }) => code);
    const counts = summary["All Time"].map((row) => row["review count"]);
    expect(codes).toStrictEqual(["CS 261", "CS 161"]);
    expect(counts).toStrictEqual(["2", "1"]);
  });

  it("averages the time commitment over the recognized reviews when a review has an unrecognized time commitment", () => {
    const reviews = [
      buildReview({ difficulty: "2", "time commitment": "6-12 hours" }),
      buildReview({ difficulty: "4", "time commitment": "a few hours" }),
    ];

    const summary = summarizeByDate(reviews, NOW);

    expect(summary["All Time"]).toStrictEqual([
      {
        code: "CS 161",
        title: "Introduction to Computer Science I",
        "average difficulty": "3",
        "time commitment": "9",
        "review count": "2",
        tags: LOWER_DIVISION_CORE_TAGS,
      },
    ]);
  });

  it.each(["a few hours", "constructor"])(
    "returns a zero time commitment when the only time commitment is %j",
    (timeCommitment) => {
      const reviews = [buildReview({ "time commitment": timeCommitment })];

      const summary = summarizeByDate(reviews, NOW);

      const [courseSummary] = summary["All Time"];
      expect(courseSummary?.["time commitment"]).toBe("0");
    },
  );
});
