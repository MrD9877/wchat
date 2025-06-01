import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: Request) {
  const cookieStore = await cookies();
  try {
    const refreshToken = cookieStore.get("refreshToken");
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (err) {
    console.log(err);
    console.log("error");
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/friends/:path*", "/chatpage/:path*", "/chatscreen/:path*", "/setting/:path*", "/"],
};
