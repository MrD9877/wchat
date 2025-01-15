import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req, res) {
  const cookieStore = await cookies();
  try {
    const refreshToken = cookieStore.get("refreshToken");
    const session = cookieStore.get("session");
    // console.log(accessToken);
    console.log("auth");
    if (!refreshToken || !session) {
      console.log("no auth");
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
