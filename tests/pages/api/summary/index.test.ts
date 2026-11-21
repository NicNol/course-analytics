import { describe, expect, it, vi } from "vitest";
import getSummaryHandler from "../../../../pages/api/summary";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview, buildSummaryRow } from "../../../support/fixtures";
import { useFixedClock } from "../../../support/fixedClock";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../../../lib/mongodb", () => ({ connectToDatabase }));
vi.mock("../../../../lib/models/course", () => ({ Course: { find } }));

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

  it("returns 405 without querying when the method is not GET", async () => {
    const request = createRequest({ method: "POST" });
    const response = createResponse();

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 200 with the summaries of the stored reviews when the method is GET", async () => {
    const request = createRequest();
    const response = createResponse();
    find.mockResolvedValue(reviews);

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(summaries);
  });

  it("returns 500 with a generic message and logs the error when the database query fails", async () => {
    const request = createRequest();
    const response = createResponse();
    const failure = new Error("query failed");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    find.mockRejectedValue(failure);

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(consoleError).toHaveBeenCalledWith(failure);
  });
});
