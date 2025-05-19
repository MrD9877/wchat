import crypto from "crypto";

export function generateRandom(bytes: number) {
  const n = crypto.randomBytes(bytes).toString("hex");
  return n;
}
export const oneDayInMS = 60 * 60 * 1000 * 24;
