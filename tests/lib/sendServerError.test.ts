import { describe, expect, it, vi } from "vitest";
import { sendServerError } from "../../lib/sendServerError";
import { createResponse } from "../support/apiMocks";

describe("sendServerError", () => {
  it("returns a 500 response without the error details", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = createResponse();
    const failure = new Error("connect ECONNREFUSED mongodb://user:secret@db.internal:27017");

    sendServerError(response, failure);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(response.send).not.toHaveBeenCalled();
  });

  it("logs the error on the server", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = createResponse();
    const failure = new Error("query failed");

    sendServerError(response, failure);

    expect(consoleError).toHaveBeenCalledWith(failure);
  });
});
