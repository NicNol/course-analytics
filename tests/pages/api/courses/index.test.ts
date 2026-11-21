import { describe, expect, it, vi } from "vitest";
import getCourses from "../../../../pages/api/courses";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview, HIDDEN_FIELDS } from "../../../support/fixtures";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../../../lib/mongodb", () => ({ connectToDatabase }));
vi.mock("../../../../lib/models/course", () => ({ Course: { find } }));

describe("getCourses", () => {
  it("returns 405 without querying when the method is not GET", async () => {
    const request = createRequest({ method: "POST" });
    const response = createResponse();

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 200 with every course review when the method is GET", async () => {
    const request = createRequest();
    const response = createResponse();
    const reviews = [buildReview({ code: "CS 161" }), buildReview({ code: "CS 162" })];
    find.mockResolvedValue(reviews);

    await getCourses(request, response);

    expect(find).toHaveBeenCalledWith({ code: { $regex: "", $options: "i" } }, HIDDEN_FIELDS);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(reviews);
  });

  it("returns 500 with a generic message and logs the error when the database query fails", async () => {
    const request = createRequest();
    const response = createResponse();
    const failure = new Error("query failed");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    find.mockRejectedValue(failure);

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(consoleError).toHaveBeenCalledWith(failure);
  });
});
