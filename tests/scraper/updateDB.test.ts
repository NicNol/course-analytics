import { describe, expect, it, vi } from "vitest";
import updateDB from "../../scraper/src/scheduler/updateDB";
import { buildSheetReview } from "../support/fixtures";
import { firstInvocationOrder } from "../support/mockCalls";

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

describe("updateDB", () => {
  it("saves the scraped reviews and disconnects when the scrape succeeds", async () => {
    const reviews = [buildSheetReview()];
    getJSON.mockResolvedValue(reviews);

    await updateDB();

    expect(saveCourses).toHaveBeenCalledWith(reviews);
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
  });

  it("prepares the sheet before reading the reviews when the scrape runs", async () => {
    getJSON.mockResolvedValue([buildSheetReview()]);

    await updateDB();

    const prepareOrder = firstInvocationOrder(prepareSheet);
    const readOrder = firstInvocationOrder(getJSON);
    expect(prepareOrder).toBeLessThan(readOrder);
  });

  it("rejects with the error and still disconnects when the spreadsheet fails", async () => {
    const failure = new Error("spreadsheet unavailable");
    getJSON.mockRejectedValue(failure);

    const update = updateDB();

    await expect(update).rejects.toBe(failure);
    expect(saveCourses).not.toHaveBeenCalled();
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
  });

  it("rejects with the error and still disconnects when the database connection fails", async () => {
    const failure = new Error("connection refused");
    connectToDatabase.mockRejectedValue(failure);

    const update = updateDB();

    await expect(update).rejects.toBe(failure);
    expect(prepareSheet).not.toHaveBeenCalled();
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
  });
});
