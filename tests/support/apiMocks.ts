import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

type RequestOptions = {
  method?: string;
  query?: Partial<Record<string, string | string[]>>;
  headers?: Record<string, string>;
};

export function createRequest({ method = "GET", query = {}, headers = {} }: RequestOptions = {}) {
  return { method, query, headers } as unknown as NextApiRequest;
}

export function createResponse() {
  const response = { status: vi.fn(), json: vi.fn(), send: vi.fn(), end: vi.fn() };
  response.status.mockReturnValue(response);
  return response as typeof response & NextApiResponse;
}
