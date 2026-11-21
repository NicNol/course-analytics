import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    /* Chakra v3 styles with Emotion. The previous `styledComponents: true` transform
       rewrote the `css` prop into styled-components, which this project never had
       as a dependency. */
    emotion: true,
  },
};

export default nextConfig;
