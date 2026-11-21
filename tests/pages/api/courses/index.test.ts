import { describe, expect, it, vi } from "vitest";
import getCourses, { getCourseData } from "../../../../pages/api/courses";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview } from "../../../support/fixtures";
import { firstInvocationOrder } from "../../../support/mockCalls";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../../../scraper/src/mongodb", () => ({ connectToDatabase }));
vi.mock("../../../../scraper/src/models/course", () => ({ Course: { find } }));

const HIDDEN_FIELDS = { _id: false, versionKey: false };

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

describe("getCourseData", () => {
  it("queries the reviews matching the course code ignoring case", async () => {
    await getCourseData("CS 261");

    expect(find).toHaveBeenCalledWith({ code: { $regex: "CS 261", $options: "i" } }, HIDDEN_FIELDS);
  });

  it("escapes regular expression characters in the course code before querying", async () => {
    await getCourseData("CS (1)");

    expect(find).toHaveBeenCalledWith({ code: { $regex: "CS \\(1\\)", $options: "i" } }, HIDDEN_FIELDS);
  });

  it("connects to the database before querying", async () => {
    await getCourseData("CS 261");

    const connectOrder = firstInvocationOrder(connectToDatabase);
    const queryOrder = firstInvocationOrder(find);
    expect(connectOrder).toBeLessThan(queryOrder);
  });
});
