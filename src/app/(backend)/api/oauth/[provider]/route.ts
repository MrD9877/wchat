import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { uploadImageDirectly } from "@/app/(backend)/utility/awsBucket";
import { downloadImage } from "@/app/(backend)/utility/downLoadImage";
import { generateRandom } from "@/app/(backend)/utility/random";
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
    await dbConnect();
    const isValidState = validState(state, cookie);
    if (!state || !isValidState) throw Error("OAuthstate is not valid");
    const { email, username, avatar, id } = await new OAuthClient(provider).fetchUser(code, getCodeVerifier(cookie));
    const publicKey = cookie.get("publicKey")?.value;
    let profilePic: string;
    const user = await User.findOne({ email });
    if (!user) {
      profilePic = generateRandom(8);
      const user = new User({ email, name: username, profilePic, userId: id, publicKey });
      await user.save();
      const buffer = await downloadImage(avatar);
      if (buffer) await uploadImageDirectly(profilePic, buffer, "image/png", false);
    } else {
      profilePic = user.profilePic;
      if (publicKey) user.publicKey = publicKey;
      await user.save();
    }
    const CookiesSet = await setCokies(email, username, profilePic, id);
    if (!CookiesSet) throw Error();
  } catch (err) {
    console.log(err);
    return redirect("/login?error=Failed to connect. Please try again ");
  }
  return redirect("/");
}
