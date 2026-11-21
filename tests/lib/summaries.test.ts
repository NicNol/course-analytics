import { describe, expect, it, vi } from "vitest";
import { getSummary } from "../../lib/summaries";
import { firstInvocationOrder } from "../support/mockCalls";

const { connectToDatabase, find } = vi.hoisted(() => ({ connectToDatabase: vi.fn(), find: vi.fn() }));

vi.mock("../../lib/mongodb", () => ({ connectToDatabase }));
vi.mock("../../lib/models/summary", () => ({ Summary: { find } }));

describe("getSummary", () => {
  it("queries the stored summaries without the database bookkeeping fields", async () => {
    await getSummary();

    expect(find).toHaveBeenCalledWith({}, { _id: false, versionKey: false });
  });

  it("connects to the database before querying", async () => {
    await getSummary();

    const connectOrder = firstInvocationOrder(connectToDatabase);
    const queryOrder = firstInvocationOrder(find);
    expect(connectOrder).toBeLessThan(queryOrder);
  });
});
