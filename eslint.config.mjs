import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [{ ignores: [".next/**", "cypress/**"] }, ...next, ...nextTypescript];

export default config;
