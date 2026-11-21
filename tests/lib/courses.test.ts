import { describe, expect, it, vi } from "vitest";
import { getCourseData } from "../../lib/courses";
import { firstInvocationOrder } from "../support/mockCalls";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../scraper/src/mongodb", () => ({ connectToDatabase }));
vi.mock("../../scraper/src/models/course", () => ({ Course: { find } }));

const HIDDEN_FIELDS = { _id: false, versionKey: false };

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
