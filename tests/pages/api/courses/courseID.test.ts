import { describe, expect, it, vi } from "vitest";
import getCourses from "../../../../pages/api/courses/[courseID]";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview } from "../../../support/fixtures";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../../../lib/survey", () => ({ getReviews }));

const cs161Review = buildReview({ code: "CS 161" });
const cs162Review = buildReview({ code: "CS 162", title: "Introduction to Computer Science II" });

describe("getCourses by course ID", () => {
  it("returns 405 without reading the survey when the method is not GET", async () => {
    const request = createRequest({ method: "POST", query: { courseID: "CS-161" } });
    const response = createResponse();

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(getReviews).not.toHaveBeenCalled();
  });

  it("returns 200 with the reviews matching the course code when the ID uses a dash", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    getReviews.mockResolvedValue([cs161Review, cs162Review]);

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([cs161Review]);
  });

  it("returns a five minute shared cache header with the reviews", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    getReviews.mockResolvedValue([cs161Review]);

    await getCourses(request, response);

    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "public, s-maxage=300");
  });

  it("returns reviews for the first ID when the query repeats the course ID", async () => {
    const request = createRequest({ query: { courseID: ["CS-162", "CS-161"] } });
    const response = createResponse();
    getReviews.mockResolvedValue([cs161Review, cs162Review]);

    await getCourses(request, response);

    expect(response.json).toHaveBeenCalledWith([cs162Review]);
  });

  it("returns 200 with no reviews when the course ID contains regular expression characters", async () => {
    const request = createRequest({ query: { courseID: ".*" } });
    const response = createResponse();
    getReviews.mockResolvedValue([cs161Review, cs162Review]);

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([]);
  });

  it.each([undefined, "", "   "])(
    "returns 400 without reading the survey when the course ID is %j",
    async (courseID) => {
      const request = createRequest({ query: { courseID } });
      const response = createResponse();

      await getCourses(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: "CourseID not provided" });
      expect(getReviews).not.toHaveBeenCalled();
    },
  );

  it("returns 500 with a generic message, no cache header, and logs the error when reading the survey fails", async () => {
    const request = createRequest({ query: { courseID: "CS-161" } });
    const response = createResponse();
    const failure = new Error("Survey download failed with status 500");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    getReviews.mockRejectedValue(failure);

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(response.setHeader).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(failure);
  });
});
