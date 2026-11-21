import { describe, expect, it } from "vitest";
import { newestWrittenReviewsFirst, toReviewStats } from "../../lib/reviews";
import { buildReview } from "../support/fixtures";

describe("newestWrittenReviewsFirst", () => {
  it("returns the reviews newest first when they are stored out of order", () => {
    const oldest = buildReview({ review: "Oldest", "review date": "1/15/2024 10:00:00" });
    const middle = buildReview({ review: "Middle", "review date": "6/15/2025 10:00:00" });
    const newest = buildReview({ review: "Newest", "review date": "3/15/2026 10:00:00" });

    const reviews = newestWrittenReviewsFirst([middle, newest, oldest]);

    expect(reviews).toStrictEqual([newest, middle, oldest]);
  });

  it("returns only the reviews with text when some reviews are blank", () => {
    const written = buildReview({ review: "Start early.", "review date": "1/15/2025 10:00:00" });
    const blank = buildReview({ review: "", "review date": "2/15/2025 10:00:00" });

    const reviews = newestWrittenReviewsFirst([written, blank]);

    expect(reviews).toStrictEqual([written]);
  });

  it("returns an empty list when the course has no reviews", () => {
    const reviews = newestWrittenReviewsFirst([]);

    expect(reviews).toStrictEqual([]);
  });

  it("leaves the given list in its original order", () => {
    const older = buildReview({ review: "Older", "review date": "1/15/2025 10:00:00" });
    const newer = buildReview({ review: "Newer", "review date": "2/15/2025 10:00:00" });
    const storedReviews = [older, newer];

    newestWrittenReviewsFirst(storedReviews);

    expect(storedReviews).toStrictEqual([older, newer]);
  });
});

describe("toReviewStats", () => {
  it("returns only the fields the data summary needs", () => {
    const review = buildReview({
      difficulty: "4",
      "time commitment": "13-18 hours",
      "review date": "3/15/2025 10:00:00",
      "other courses": ["CS 261 - Data Structures"],
      review: "Start early.",
    });

    const stats = toReviewStats(review);

    expect(stats).toStrictEqual({
      difficulty: "4",
      "time commitment": "13-18 hours",
      "review date": "3/15/2025 10:00:00",
      "other courses": ["CS 261 - Data Structures"],
    });
  });
});
