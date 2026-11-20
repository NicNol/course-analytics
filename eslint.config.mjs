import next from "eslint-config-next/core-web-vitals";

const config = [{ ignores: [".next/**", "cypress/**"] }, ...next];

export default config;
