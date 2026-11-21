import { beforeEach, describe, expect, it, vi } from "vitest";

const { connect, transaction } = vi.hoisted(() => ({ connect: vi.fn(), transaction: vi.fn() }));

vi.mock("mongoose", () => ({ default: { connect, connection: { transaction } } }));

const MONGODB_URI = "mongodb://localhost:27017/course-analytics";

function buildClient() {
  return { connection: { close: vi.fn() } };
}

async function loadMongodbModule() {
  vi.resetModules();
  return import("../../lib/mongodb");
}

describe("mongodb", () => {
  beforeEach(() => {
    globalThis.mongoose = undefined;
    vi.stubEnv("MONGODB_URI", MONGODB_URI);
  });

  describe("connectToDatabase", () => {
    it("rejects naming MONGODB_URI when the variable is not set", async () => {
      vi.stubEnv("MONGODB_URI", "");
      const { connectToDatabase } = await loadMongodbModule();

      const connection = connectToDatabase();

      await expect(connection).rejects.toThrow("MONGODB_URI");
      expect(connect).not.toHaveBeenCalled();
    });

    it("returns the client connected with buffering disabled when the variable is set", async () => {
      const client = buildClient();
      connect.mockResolvedValue(client);
      const { connectToDatabase } = await loadMongodbModule();

      const connection = await connectToDatabase();

      expect(connect).toHaveBeenCalledWith(MONGODB_URI, { bufferCommands: false });
      expect(connection).toBe(client);
    });

    it("returns the same connection without reconnecting when called again", async () => {
      connect.mockResolvedValue(buildClient());
      const { connectToDatabase } = await loadMongodbModule();

      const firstConnection = await connectToDatabase();
      const secondConnection = await connectToDatabase();

      expect(connect).toHaveBeenCalledTimes(1);
      expect(secondConnection).toBe(firstConnection);
    });

    it("returns a new connection when called again after a failed attempt", async () => {
      const failure = new Error("connection refused");
      const client = buildClient();
      connect.mockRejectedValueOnce(failure).mockResolvedValueOnce(client);
      const { connectToDatabase } = await loadMongodbModule();

      const failedAttempt = connectToDatabase();
      await expect(failedAttempt).rejects.toBe(failure);
      const retriedConnection = await connectToDatabase();

      expect(connect).toHaveBeenCalledTimes(2);
      expect(retriedConnection).toBe(client);
    });
  });

  describe("disconnectFromDatabase", () => {
    it("closes the connection when connected", async () => {
      const client = buildClient();
      connect.mockResolvedValue(client);
      const { connectToDatabase, disconnectFromDatabase } = await loadMongodbModule();
      await connectToDatabase();

      await disconnectFromDatabase();

      expect(client.connection.close).toHaveBeenCalledTimes(1);
    });

    it("returns without connecting when no connection was started", async () => {
      const { disconnectFromDatabase } = await loadMongodbModule();

      const disconnect = disconnectFromDatabase();

      await expect(disconnect).resolves.toBeUndefined();
      expect(connect).not.toHaveBeenCalled();
    });
  });

  describe("runInTransaction", () => {
    it("runs the work through the Mongoose connection transaction and returns its result", async () => {
      const transactionResult = { committed: true };
      transaction.mockResolvedValue(transactionResult);
      const work = vi.fn();
      const { runInTransaction } = await loadMongodbModule();

      const result = await runInTransaction(work);

      expect(transaction).toHaveBeenCalledWith(work);
      expect(result).toBe(transactionResult);
    });

    it.each([
      "This MongoDB deployment does not support retryable writes. Please add retryWrites=false to your connection string.",
      "Transaction numbers are only allowed on a replica set member or mongos",
    ])(
      "rejects naming the replica set requirement and keeping the cause when the server says %j",
      async (serverMessage) => {
        const serverError = new Error(serverMessage);
        transaction.mockRejectedValue(serverError);
        const { runInTransaction } = await loadMongodbModule();

        const running = runInTransaction(vi.fn());

        await expect(running).rejects.toThrow(/replica set/);
        await expect(running).rejects.toMatchObject({ cause: serverError });
      },
    );

    it("rejects with the same error when the transaction fails for another reason", async () => {
      const failure = new Error("transaction aborted");
      transaction.mockRejectedValue(failure);
      const { runInTransaction } = await loadMongodbModule();

      const running = runInTransaction(vi.fn());

      await expect(running).rejects.toBe(failure);
    });
  });
});
