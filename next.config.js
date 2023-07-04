/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: ["/src/scraper"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
