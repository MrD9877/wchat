import { NextResponse } from "next/server";
import { checkAuth } from "./app/(backend)/utility/checkAuth";

export async function middleware(req, res) {
  const response = NextResponse.next();
  return response;
}
export const config = {
  matcher: "/api/auth/:path*",
};
