import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["pages/**", "components/**", "scraper/src/**"],
      reporter: ["text-summary", "text"],
    },
    projects: [
      {
        extends: true,
        test: { name: "node", environment: "node", include: ["tests/**/*.test.ts"] },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: ["tests/**/*.test.tsx"],
          setupFiles: ["tests/support/domSetup.ts"],
        },
      },
    ],
  },
});
