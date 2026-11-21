import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSummary } from "../../lib/summaries";
import { buildReview } from "../support/fixtures";
import { firstInvocationOrder } from "../support/mockCalls";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../lib/mongodb", () => ({ connectToDatabase }));
vi.mock("../../lib/models/course", () => ({ Course: { find } }));

const recentReview = buildReview({
  difficulty: "1",
  "time commitment": "0-5 hours",
  "review date": "6/1/2026 10:00:00",
});
const olderReview = buildReview({
  difficulty: "3",
  "time commitment": "6-12 hours",
  "review date": "6/1/2025 10:00:00",
});
const cs161Tags = ["Lower Division", "Core Class"];

describe("getSummary", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns one document with the stored reviews summarized for each date range", async () => {
    find.mockResolvedValue([recentReview, olderReview]);
    const cs161Row = { code: "CS 161", title: "Introduction to Computer Science I", tags: cs161Tags };

    const summary = await getSummary();

    expect(summary).toStrictEqual([
      {
        "All Time": [{ ...cs161Row, "average difficulty": "2", "time commitment": "6", "review count": "2" }],
        "Past 2 Years": [{ ...cs161Row, "average difficulty": "2", "time commitment": "6", "review count": "2" }],
        "Past 6 Months": [{ ...cs161Row, "average difficulty": "1", "time commitment": "3", "review count": "1" }],
      },
    ]);
  });

  it("connects to the database before querying", async () => {
    find.mockResolvedValue([]);

    await getSummary();

    const connectOrder = firstInvocationOrder(connectToDatabase);
    const queryOrder = firstInvocationOrder(find);
    expect(connectOrder).toBeLessThan(queryOrder);
  });
});
