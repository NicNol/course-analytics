import { describe, expect, it, vi } from "vitest";
import { getStaticPaths, getStaticProps } from "../../../pages/courses/[courseid]";
import { buildMonthlyReviews, buildReview } from "../../support/fixtures";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../../lib/survey", () => ({ getReviews }));

describe("getStaticPaths", () => {
  it("returns a dashed slug for each course in the class list and 404s other slugs", async () => {
    const { paths, fallback } = await getStaticPaths();

    expect(paths).toContainEqual({ params: { courseid: "CS-374" } });
    expect(paths).toContainEqual({ params: { courseid: "MTH-231" } });
    expect(paths).not.toContainEqual({ params: { courseid: "CS-344" } });
    expect(fallback).toBe(false);
  });
});

describe("getStaticProps", () => {
  it("returns only the reviews of the course matching the dashed slug", async () => {
    const operatingSystemsReview = buildReview({
      code: "CS 374",
      title: "Operating Systems I",
      review: "Read the man pages.",
    });
    const introReview = buildReview({ code: "CS 161", review: "Start early." });
    getReviews.mockResolvedValue([operatingSystemsReview, introReview]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(result.props.firstReviews).toStrictEqual([operatingSystemsReview]);
  });

  it("returns the spaced course code when given a dashed slug", async () => {
    getReviews.mockResolvedValue([]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(result.props.courseid).toBe("CS 374");
  });

  it("returns stats for every review and only the ten newest written reviews", async () => {
    const reviews = buildMonthlyReviews(12);
    const blankReview = buildReview({ code: "CS 374", review: "", "review date": "6/15/2025 10:00:00" });
    getReviews.mockResolvedValue([...reviews, blankReview]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    const firstReviewTexts = result.props.firstReviews.map(({ review }) => review);
    expect(result.props.reviewStats).toHaveLength(13);
    expect(firstReviewTexts).toStrictEqual([
      "Review number 12",
      "Review number 11",
      "Review number 10",
      "Review number 9",
      "Review number 8",
      "Review number 7",
      "Review number 6",
      "Review number 5",
      "Review number 4",
      "Review number 3",
    ]);
  });

  it("returns the count of written reviews without the blank ones", async () => {
    const blankReview = buildReview({ code: "CS 374", review: "", "review date": "6/15/2025 10:00:00" });
    getReviews.mockResolvedValue([...buildMonthlyReviews(12), blankReview]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(result.props.writtenReviewCount).toBe(12);
  });

  it("returns review stats without the review text", async () => {
    getReviews.mockResolvedValue([
      buildReview({
        code: "CS 374",
        difficulty: "4",
        "time commitment": "13-18 hours",
        "review date": "3/15/2025 10:00:00",
        "other courses": ["CS 261 - Data Structures"],
        review: "Start early.",
      }),
    ]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(result.props.reviewStats).toStrictEqual([
      {
        difficulty: "4",
        "time commitment": "13-18 hours",
        "review date": "3/15/2025 10:00:00",
        "other courses": ["CS 261 - Data Structures"],
      },
    ]);
  });

  it("returns a page that regenerates hourly", async () => {
    getReviews.mockResolvedValue([]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(result.revalidate).toBe(3600);
  });
});
