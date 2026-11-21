import { createHash, timingSafeEqual } from "node:crypto";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function isValidCronKey(authorization: string | undefined, cronKey: string | undefined) {
  if (!cronKey || authorization === undefined) return false;
  return timingSafeEqual(digest(authorization), digest(cronKey));
}
