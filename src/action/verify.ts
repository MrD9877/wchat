"use server";
import jwt from "jsonwebtoken";
export async function verify(t: string, s: string) {
  const c = jwt.verify(t, s);
  return c;
}
