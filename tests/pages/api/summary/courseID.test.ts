import { describe, expect, it, vi } from "vitest";
import getSummary from "../../../../pages/api/summary/[courseID]";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview, buildSummaryRow } from "../../../support/fixtures";
import { useFixedClock } from "../../../support/fixedClock";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../../../lib/survey", () => ({ getReviews }));

const surveyReviews = [
  buildReview({ code: "CS 161", difficulty: "2", "time commitment": "6-12 hours", "review date": "6/1/2025 10:00:00" }),
  buildReview({
    code: "CS 162",
    title: "Introduction to Computer Science II",
    difficulty: "2",
    "time commitment": "6-12 hours",
    "review date": "6/1/2026 10:00:00",
  }),
];
const cs161Row = buildSummaryRow({
  code: "CS 161",
  "average difficulty": "2",
  "time commitment": "9",
  "review count": "1",
});
const cs161RowWithoutRecentReviews = {
  ...cs161Row,
  "average difficulty": "0",
  "time commitment": "0",
  "review count": "0",
};
const cs162Row = buildSummaryRow({
  code: "CS 162",
  title: "Introduction to Computer Science II",
  "average difficulty": "2",
  "time commitment": "9",
  "review count": "1",
});

describe("getSummary by course ID", () => {
  useFixedClock("2026-06-15T12:00:00Z");

  it("returns 405 without reading the survey when the method is not GET", async () => {
    const request = createRequest({ method: "POST", query: { courseID: "CS-161" } });
    const response = createResponse();

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(getReviews).not.toHaveBeenCalled();
  });

  it("returns 200 with only the requested course in every date range", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    getReviews.mockResolvedValue(surveyReviews);

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([
      { "All Time": [cs161Row], "Past 2 Years": [cs161Row], "Past 6 Months": [cs161RowWithoutRecentReviews] },
    ]);
  });

  it("returns a five minute shared cache header with the summary", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    getReviews.mockResolvedValue(surveyReviews);

    await getSummary(request, response);

    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "public, s-maxage=300");
  });

  it("returns the first course in the query when the course ID is repeated", async () => {
    const request = createRequest({ query: { courseID: ["CS-162", "CS-161"] } });
    const response = createResponse();
    getReviews.mockResolvedValue(surveyReviews);

    await getSummary(request, response);

    expect(response.json).toHaveBeenCalledWith([
      { "All Time": [cs162Row], "Past 2 Years": [cs162Row], "Past 6 Months": [cs162Row] },
    ]);
  });

  it("returns 400 without reading the survey when the course ID is missing", async () => {
    const request = createRequest();
    const response = createResponse();

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: "CourseID not provided" });
    expect(getReviews).not.toHaveBeenCalled();
  });

  it("returns 500 with a generic message, no cache header, and logs the error when reading the survey fails", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    const failure = new Error("Survey download failed with status 500");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    getReviews.mockRejectedValue(failure);

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(response.setHeader).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(failure);
  });
});
