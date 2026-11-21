import type { NextConfig } from "next";
import { validateEnv } from "./lib/envSchema";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    /* Chakra v3 styles with Emotion. The previous `styledComponents: true` transform
       rewrote the `css` prop into styled-components, which this project never had
       as a dependency. */
    emotion: true,
  },
};

export default function config() {
  validateEnv(process.env);
  return nextConfig;
}
