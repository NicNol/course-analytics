import { describe, expect, it, vi } from "vitest";
import { getAllCourseData, getCourseData } from "../../lib/courses";
import { HIDDEN_FIELDS } from "../support/fixtures";
import { firstInvocationOrder } from "../support/mockCalls";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../lib/mongodb", () => ({ connectToDatabase }));
vi.mock("../../lib/models/course", () => ({ Course: { find } }));

describe("getAllCourseData", () => {
  it("queries the reviews of every course", async () => {
    await getAllCourseData();

    expect(find).toHaveBeenCalledWith({ code: { $regex: "", $options: "i" } }, HIDDEN_FIELDS);
  });

  it("connects to the database before querying", async () => {
    await getAllCourseData();

    const connectOrder = firstInvocationOrder(connectToDatabase);
    const queryOrder = firstInvocationOrder(find);
    expect(connectOrder).toBeLessThan(queryOrder);
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

  it.each([
    ["is empty", ""],
    ["is only whitespace", "  "],
  ])("rejects without connecting or querying when the course code %s", async (_scenario, courseCode) => {
    const courses = getCourseData(courseCode);

    await expect(courses).rejects.toThrow("course code");
    expect(connectToDatabase).not.toHaveBeenCalled();
    expect(find).not.toHaveBeenCalled();
  });
});
