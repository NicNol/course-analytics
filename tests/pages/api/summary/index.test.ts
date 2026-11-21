import { describe, expect, it, vi } from "vitest";
import getSummaryHandler from "../../../../pages/api/summary";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview, buildSummaryRow } from "../../../support/fixtures";
import { useFixedClock } from "../../../support/fixedClock";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../../../lib/survey", () => ({ getReviews }));

const reviews = [buildReview({ difficulty: "2", "time commitment": "6-12 hours", "review date": "6/1/2026 10:00:00" })];
const summaryRow = buildSummaryRow({
  code: "CS 161",
  "average difficulty": "2",
  "time commitment": "9",
  "review count": "1",
});
const summaries = [{ "All Time": [summaryRow], "Past 2 Years": [summaryRow], "Past 6 Months": [summaryRow] }];

describe("summary handler", () => {
  useFixedClock("2026-06-15T12:00:00Z");

  it("returns 405 without reading the survey when the method is not GET", async () => {
    const request = createRequest({ method: "POST" });
    const response = createResponse();

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(getReviews).not.toHaveBeenCalled();
  });

  it("returns 200 with the summaries of the survey reviews when the method is GET", async () => {
    const request = createRequest();
    const response = createResponse();
    getReviews.mockResolvedValue(reviews);

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(summaries);
  });

  it("returns a five minute shared cache header with the summaries", async () => {
    const request = createRequest();
    const response = createResponse();
    getReviews.mockResolvedValue(reviews);

    await getSummaryHandler(request, response);

    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "public, s-maxage=300");
  });

  it("returns 500 with a generic message, no cache header, and logs the error when reading the survey fails", async () => {
    const request = createRequest();
    const response = createResponse();
    const failure = new Error("Survey download failed with status 500");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    getReviews.mockRejectedValue(failure);

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(response.setHeader).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(failure);
  });
});
