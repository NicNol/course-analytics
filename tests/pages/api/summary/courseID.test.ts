import { describe, expect, it, vi } from "vitest";
import getSummary from "../../../../pages/api/summary/[courseID]";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildSummaryRow } from "../../../support/fixtures";

const { find } = vi.hoisted(() => ({ find: vi.fn() }));

vi.mock("../../../../scraper/src/mongodb", () => ({ connectToDatabase: vi.fn() }));
vi.mock("../../../../scraper/src/models/summary", () => ({ Summary: { find } }));

const cs161Row = buildSummaryRow({ code: "CS 161" });
const cs162Row = buildSummaryRow({ code: "CS 162", title: "Introduction to Computer Science II" });
const storedSummaries = [
  {
    "All Time": [cs161Row, cs162Row],
    "Past 2 Years": [cs161Row, cs162Row],
    "Past 6 Months": [cs162Row],
  },
];

describe("getSummary by course ID", () => {
  it("returns 405 without querying when the method is not GET", async () => {
    const request = createRequest({ method: "POST", query: { courseID: "CS-161" } });
    const response = createResponse();

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 200 with only the requested course in every date range", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    find.mockResolvedValue(storedSummaries);

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([
      { "All Time": [cs161Row], "Past 2 Years": [cs161Row], "Past 6 Months": [] },
    ]);
  });

  it("returns the first course in the query when the course ID is repeated", async () => {
    const request = createRequest({ query: { courseID: ["CS-162", "CS-161"] } });
    const response = createResponse();
    find.mockResolvedValue(storedSummaries);

    await getSummary(request, response);

    expect(response.json).toHaveBeenCalledWith([
      { "All Time": [cs162Row], "Past 2 Years": [cs162Row], "Past 6 Months": [cs162Row] },
    ]);
  });

  it("returns 500 without querying when the course ID is missing", async () => {
    const request = createRequest();
    const response = createResponse();

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith("CourseID not provided");
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 500 with the error when the database query fails", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    const failure = new Error("query failed");
    find.mockRejectedValue(failure);

    await getSummary(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(failure);
  });
});
