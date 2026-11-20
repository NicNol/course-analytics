import { describe, expect, it, vi } from "vitest";
import updateDB from "../../scraper/src/scheduler/updateDB";
import { buildSheetReview } from "../support/fixtures";

const { prepareSheet, getJSON, saveCourses, connectToDatabase, disconnectFromDatabase } = vi.hoisted(() => ({
  prepareSheet: vi.fn(),
  getJSON: vi.fn(),
  saveCourses: vi.fn(),
  connectToDatabase: vi.fn(),
  disconnectFromDatabase: vi.fn(),
}));

vi.mock("../../scraper/src/scheduler/helper/sheets", () => ({ prepareSheet, getJSON }));
vi.mock("../../scraper/src/scheduler/helper/summarize", () => ({ saveCourses }));
vi.mock("../../scraper/src/mongodb", () => ({ connectToDatabase, disconnectFromDatabase }));

function silenceConsoleError() {
  return vi.spyOn(console, "error").mockImplementation(() => undefined);
}

describe("updateDB", () => {
  it("saves the scraped reviews and disconnects when the scrape succeeds", async () => {
    const consoleError = silenceConsoleError();
    const reviews = [buildSheetReview()];
    getJSON.mockResolvedValue(reviews);

    await updateDB();

    expect(saveCourses).toHaveBeenCalledWith(reviews);
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("prepares the sheet before reading the reviews when the scrape runs", async () => {
    silenceConsoleError();
    getJSON.mockResolvedValue([buildSheetReview()]);

    await updateDB();

    const prepareOrder = prepareSheet.mock.invocationCallOrder[0];
    const readOrder = getJSON.mock.invocationCallOrder[0];
    expect(prepareOrder).toBeLessThan(readOrder);
  });

  it("returns normally after logging the error when the spreadsheet fails", async () => {
    const consoleError = silenceConsoleError();
    const failure = new Error("spreadsheet unavailable");
    getJSON.mockRejectedValue(failure);

    const update = updateDB();

    await expect(update).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(failure);
    expect(saveCourses).not.toHaveBeenCalled();
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
  });

  it("returns normally after logging the error when the database connection fails", async () => {
    const consoleError = silenceConsoleError();
    const failure = new Error("connection refused");
    connectToDatabase.mockRejectedValue(failure);

    const update = updateDB();

    await expect(update).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(failure);
    expect(prepareSheet).not.toHaveBeenCalled();
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
  });
});
