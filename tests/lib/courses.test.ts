import { describe, expect, it, vi } from "vitest";
import { getCourseData } from "../../lib/courses";
import { buildReview } from "../support/fixtures";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../lib/survey", () => ({ getReviews }));

const cs161Review = buildReview({ code: "CS 161" });
const cs162Review = buildReview({ code: "CS 162", title: "Introduction to Computer Science II" });
const cs261Review = buildReview({ code: "CS 261", title: "Data Structures" });
const mth231Review = buildReview({ code: "MTH 231", title: "Elements of Discrete Mathematics" });
const surveyReviews = [cs161Review, cs162Review, cs261Review, mth231Review];

describe("getCourseData", () => {
  it("returns only the reviews whose course code matches", async () => {
    getReviews.mockResolvedValue(surveyReviews);

    const reviews = await getCourseData("CS 261");

    expect(reviews).toStrictEqual([cs261Review]);
  });

  it("returns the matching reviews when the course code differs in case", async () => {
    getReviews.mockResolvedValue(surveyReviews);

    const reviews = await getCourseData("mth 231");

    expect(reviews).toStrictEqual([mth231Review]);
  });

  it("returns every review whose course code contains a partial code", async () => {
    getReviews.mockResolvedValue(surveyReviews);

    const reviews = await getCourseData("CS 16");

    expect(reviews).toStrictEqual([cs161Review, cs162Review]);
  });

  it("returns no reviews when the course code contains regular expression characters", async () => {
    getReviews.mockResolvedValue(surveyReviews);

    const reviews = await getCourseData(".*");

    expect(reviews).toStrictEqual([]);
  });

  it.each([
    ["is empty", ""],
    ["is only whitespace", "  "],
  ])("rejects without reading the survey when the course code %s", async (_scenario, courseCode) => {
    const reviews = getCourseData(courseCode);

    await expect(reviews).rejects.toThrow("course code");
    expect(getReviews).not.toHaveBeenCalled();
  });
});
