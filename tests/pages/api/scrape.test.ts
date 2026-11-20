import { beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../../pages/api/scrape";
import { classList } from "../../../scraper/src/classList";
import updateDB from "../../../scraper/src/scheduler/updateDB";
import { createRequest, createResponse } from "../../support/apiMocks";

vi.mock("../../../scraper/src/scheduler/updateDB", () => ({ default: vi.fn() }));

const CRON_KEY = "test-cron-key";

describe("scrape handler", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_KEY", CRON_KEY);
  });

  it("returns 405 without scraping when the method is not GET", async () => {
    const request = createRequest({ method: "POST", headers: { authorization: CRON_KEY } });
    const response = createResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(updateDB).not.toHaveBeenCalled();
  });

  it.each([
    ["is missing", {}],
    ["does not match the cron key", { authorization: "wrong-key" }],
  ])("returns 401 without scraping when the authorization header %s", async (_scenario, headers) => {
    const request = createRequest({ headers });
    const response = createResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(updateDB).not.toHaveBeenCalled();
  });

  it("returns 401 without scraping when the cron key is not configured and the request has no authorization header", async () => {
    vi.stubEnv("CRON_KEY", undefined);
    const request = createRequest();
    const response = createResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(updateDB).not.toHaveBeenCalled();
  });

  it("returns 200 after scraping when the authorization header matches the cron key", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();
    vi.mocked(updateDB).mockResolvedValue(undefined);

    await handler(request, response);

    expect(updateDB).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: "Success!" });
  });

  it("revalidates the home page and every course page after scraping", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();
    const coursePaths = classList.map((course) => `/courses/${course.code.replace(" ", "-")}`);

    await handler(request, response);

    const revalidatedPaths = vi.mocked(response.revalidate).mock.calls.map(([path]) => path);
    expect(revalidatedPaths).toEqual(["/", ...coursePaths]);
  });

  it("returns 500 with the error when revalidation fails", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();
    const failure = new Error("revalidation failed");
    response.revalidate.mockRejectedValue(failure);

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(failure);
  });

  it("returns 500 with the error when scraping fails", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();
    const failure = new Error("database closed");
    vi.mocked(updateDB).mockRejectedValue(failure);

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(failure);
    expect(response.revalidate).not.toHaveBeenCalled();
  });
});
