import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

function matchMediaWithoutMatches(query: string) {
  return {
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  };
}

vi.stubGlobal("matchMedia", matchMediaWithoutMatches);

class ResizeObserverWithoutEntries {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverWithoutEntries);
