import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { deployedEnvSchema, siteEnvSchema, validateEnv } from "./lib/envSchema";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    /* Chakra v3 styles with Emotion. The previous `styledComponents: true` transform
       rewrote the `css` prop into styled-components, which this project never had
       as a dependency. */
    emotion: true,
  },
};

export default function config(phase: string) {
  const schema = phase === PHASE_PRODUCTION_BUILD ? deployedEnvSchema : siteEnvSchema;
  validateEnv(process.env, schema);
  return nextConfig;
}
