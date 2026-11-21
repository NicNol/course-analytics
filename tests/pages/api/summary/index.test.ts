import { describe, expect, it, vi } from "vitest";
import getSummaryHandler from "../../../../pages/api/summary";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildSummaryRow } from "../../../support/fixtures";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../../../lib/mongodb", () => ({ connectToDatabase }));
vi.mock("../../../../lib/models/summary", () => ({ Summary: { find } }));

const summaries = [
  {
    "All Time": [buildSummaryRow()],
    "Past 2 Years": [buildSummaryRow()],
    "Past 6 Months": [buildSummaryRow()],
  },
];

describe("summary handler", () => {
  it("returns 405 without querying when the method is not GET", async () => {
    const request = createRequest({ method: "POST" });
    const response = createResponse();

    await getSummaryHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 200 with the stored summaries when the method is GET", async () => {
    const request = createRequest();
    const response = createResponse();
    find.mockResolvedValue(summaries);

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
