import { afterEach, beforeEach, vi } from "vitest";

export function useFixedClock(isoDate: string) {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(isoDate));
  });

  afterEach(() => {
    vi.useRealTimers();
  });
}
