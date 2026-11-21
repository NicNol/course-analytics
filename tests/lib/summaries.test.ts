import { describe, expect, it, vi } from "vitest";
import { getSummary } from "../../lib/summaries";
import { buildReview } from "../support/fixtures";
import { useFixedClock } from "../support/fixedClock";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../lib/survey", () => ({ getReviews }));

const cs161Tags = ["Lower Division", "Core Class"];

describe("getSummary", () => {
  useFixedClock("2026-06-15T12:00:00Z");

  it("returns one document with the survey reviews summarized for each date range", async () => {
    const recentReview = buildReview({
      difficulty: "1",
      "time commitment": "0-5 hours",
      "review date": "6/1/2026 10:00:00",
    });
    const olderReview = buildReview({
      difficulty: "3",
      "time commitment": "6-12 hours",
      "review date": "6/1/2025 10:00:00",
    });
    getReviews.mockResolvedValue([recentReview, olderReview]);
    const cs161Row = { code: "CS 161", title: "Introduction to Computer Science I", tags: cs161Tags };

    const summary = await getSummary();

    expect(summary).toStrictEqual([
      {
        "All Time": [{ ...cs161Row, "average difficulty": "2", "time commitment": "6", "review count": "2" }],
        "Past 2 Years": [{ ...cs161Row, "average difficulty": "2", "time commitment": "6", "review count": "2" }],
        "Past 6 Months": [{ ...cs161Row, "average difficulty": "1", "time commitment": "3", "review count": "1" }],
      },
    ]);
  });
});
