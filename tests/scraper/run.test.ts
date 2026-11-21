import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import updateDB from "../../scraper/src/scheduler/updateDB";

vi.mock("../../scraper/src/scheduler/updateDB", () => ({ default: vi.fn() }));

async function runScrapeScript(scrape: Promise<void>) {
  const settled = scrape.catch(() => undefined);
  vi.mocked(updateDB).mockReturnValue(scrape);
  await import("../../scraper/src/scheduler/updateDB/run");
  await settled;
}

describe("scrape script", () => {
  beforeEach(() => {
    vi.resetModules();
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = undefined;
  });

  it("exits with code 1 and logs the error when the scrape fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const failure = new Error("spreadsheet unavailable");

    await runScrapeScript(Promise.reject(failure));

    expect(process.exitCode).toBe(1);
    expect(consoleError).toHaveBeenCalledWith(failure);
  });

  it("leaves the exit code unset and logs nothing when the scrape succeeds", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await runScrapeScript(Promise.resolve());

    expect(process.exitCode).toBeUndefined();
    expect(consoleError).not.toHaveBeenCalled();
  });
});
