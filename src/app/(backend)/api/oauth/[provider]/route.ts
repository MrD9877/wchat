import { User } from "@/app/(backend)/model/User";
import { setCokies } from "@/app/(backend)/utility/setCokie";
import { getCodeVerifier, OAuthClient, OAuthProviders, validState } from "@/utility/authClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: rawProvider } = await params;
  const cookie = await cookies();
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const provider = z.enum(OAuthProviders).parse(rawProvider);
  if (typeof code !== "string") return redirect("/login?error=Failed to connect. Please try again");
  try {
    const isValidState = validState(state, cookie);
    if (!isValidState) throw Error("OAuthstate is not valid");
    const { email, username, avatar, id } = await new OAuthClient(provider).fetchUser(code, getCodeVerifier(cookie));
    const user = new User({ email, name: username, profilePic: avatar, userId: id });
    await user.save();
    const CookiesSet = await setCokies(email, username, avatar, id);
    if (!CookiesSet) throw Error();
  } catch (err) {
    console.log(err);
    return redirect("/login?error=Failed to connect. Please try again ");
  }
  return redirect("/");
}
