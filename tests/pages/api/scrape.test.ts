import { beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../../pages/api/scrape";
import { classList } from "../../../lib/classList";
import updateDB from "../../../scraper/updateDB";
import { createRequest, createResponse } from "../../support/apiMocks";
import { firstInvocationOrder } from "../../support/mockCalls";

vi.mock("../../../scraper/updateDB", () => ({ default: vi.fn() }));

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

  it.each([
    ["has no authorization header", {}],
    ["has an empty authorization header", { authorization: "" }],
  ])(
    "returns 401 without scraping when the cron key is not configured and the request %s",
    async (_scenario, headers) => {
      vi.stubEnv("CRON_KEY", undefined);
      const request = createRequest({ headers });
      const response = createResponse();

      await handler(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(updateDB).not.toHaveBeenCalled();
    },
  );

  it("returns 401 without scraping when the cron key is empty and the request has an empty authorization header", async () => {
    vi.stubEnv("CRON_KEY", "");
    const request = createRequest({ headers: { authorization: "" } });
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

  it("revalidates the home page and every current course page when the scrape succeeds", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();

    await handler(request, response);

    const revalidatedPaths = vi.mocked(response.revalidate).mock.calls.map(([path]) => path);
    expect(revalidatedPaths).toHaveLength(classList.length + 1);
    expect(revalidatedPaths).toEqual(expect.arrayContaining(["/", "/courses/CS-161", "/courses/CS-374"]));
    expect(revalidatedPaths).not.toContain("/courses/CS-344");
  });

  it("revalidates the pages only after the database update finishes", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();

    await handler(request, response);

    const scrapeOrder = firstInvocationOrder(vi.mocked(updateDB));
    const firstRevalidateOrder = firstInvocationOrder(response.revalidate);
    expect(scrapeOrder).toBeLessThan(firstRevalidateOrder);
  });

  it("returns 500 with a generic message and logs the error when revalidation fails", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();
    const failure = new Error("revalidation failed");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    response.revalidate.mockRejectedValue(failure);

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(consoleError).toHaveBeenCalledWith(failure);
  });

  it("returns 500 with a generic message and logs the error when scraping fails", async () => {
    const request = createRequest({ headers: { authorization: CRON_KEY } });
    const response = createResponse();
    const failure = new Error("database closed");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(updateDB).mockRejectedValue(failure);

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(consoleError).toHaveBeenCalledWith(failure);
    expect(response.revalidate).not.toHaveBeenCalled();
  });
});
