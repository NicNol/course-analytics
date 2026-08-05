import next from "eslint-config-next/core-web-vitals";

const config = [{ ignores: ["scraper/**", ".next/**", "cypress/**"] }, ...next];

export default config;
