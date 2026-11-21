import { describe, expect, it, vi } from "vitest";
import getCourses from "../../../../pages/api/courses";
import { createRequest, createResponse } from "../../../support/apiMocks";
import { buildReview } from "../../../support/fixtures";

const { getReviews } = vi.hoisted(() => ({ getReviews: vi.fn() }));

vi.mock("../../../../lib/survey", () => ({ getReviews }));

describe("getCourses", () => {
  it("returns 405 without reading the survey when the method is not GET", async () => {
    const request = createRequest({ method: "POST" });
    const response = createResponse();

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(getReviews).not.toHaveBeenCalled();
  });

  it("returns 200 with every course review when the method is GET", async () => {
    const request = createRequest();
    const response = createResponse();
    const reviews = [buildReview({ code: "CS 161" }), buildReview({ code: "CS 162" })];
    getReviews.mockResolvedValue(reviews);

    await getCourses(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(reviews);
  });

  it("returns a five minute shared cache header with the reviews", async () => {
    const request = createRequest();
    const response = createResponse();
    getReviews.mockResolvedValue([buildReview()]);

    await getCourses(request, response);

    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "public, s-maxage=300");
  });

  it("returns 500 with a generic message, no cache header, and logs the error when reading the survey fails", async () => {
    const request = createRequest();
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
