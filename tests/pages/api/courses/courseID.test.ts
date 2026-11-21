import { describe, expect, it, vi } from "vitest";
import getCourses from "../../../../pages/api/courses/[courseID]";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview } from "../../../support/fixtures";

const { find } = vi.hoisted(() => ({ find: vi.fn() }));

vi.mock("../../../../scraper/src/mongodb", () => ({ connectToDatabase: vi.fn() }));
vi.mock("../../../../scraper/src/models/course", () => ({ Course: { find } }));

const HIDDEN_FIELDS = { _id: false, versionKey: false };

describe("getCourses by course ID", () => {
  it("returns 405 without querying when the method is not GET", async () => {
    const request = createRequest({ method: "POST", query: { courseID: "CS-161" } });
    const response = createResponse();

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 200 with the reviews matching the course code when the ID uses a dash", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    const reviews = [buildReview({ code: "CS 161" })];
    find.mockResolvedValue(reviews);

    await getCourses(request, response);

    expect(find).toHaveBeenCalledWith({ code: { $regex: "CS 161", $options: "i" } }, HIDDEN_FIELDS);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(reviews);
  });

  it("returns reviews for the first ID when the query repeats the course ID", async () => {
    const request = createRequest({ query: { courseID: ["CS-162", "CS-161"] } });
    const response = createResponse();
    find.mockResolvedValue([]);

    await getCourses(request, response);

    expect(find).toHaveBeenCalledWith({ code: { $regex: "CS 162", $options: "i" } }, HIDDEN_FIELDS);
  });

  it("escapes regular expression characters in the course ID before querying", async () => {
    const request = createRequest({ query: { courseID: ".*" } });
    const response = createResponse();
    find.mockResolvedValue([]);

    await getCourses(request, response);

    expect(find).toHaveBeenCalledWith({ code: { $regex: "\\.\\*", $options: "i" } }, HIDDEN_FIELDS);
  });

  it("returns 400 without querying when the course ID is missing", async () => {
    const request = createRequest();
    const response = createResponse();

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: "CourseID not provided" });
    expect(find).not.toHaveBeenCalled();
  });

  it.each([
    ["empty", ""],
    ["blank", "   "],
  ])("returns 400 without querying when the course ID is %s", async (_description, courseID) => {
    const request = createRequest({ query: { courseID } });
    const response = createResponse();

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: "CourseID not provided" });
    expect(find).not.toHaveBeenCalled();
  });

  it("returns 500 with a generic message and logs the error when the database query fails", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
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
