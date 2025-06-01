import { cookies } from "next/headers";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { sendOtp } from "../../utility/sendOtp";
import { generateRandom } from "../../utility/random";
import { getAndSetAvatarDp } from "../../utility/setInitialAvatar";

export async function POST(request: Request) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await request.json();
  const profilePic = generateRandom(8);
  const userId = generateRandom(8);
  const { email, name } = body;
  try {
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return new Response(JSON.stringify({ msg: "This email is Already has a account please Login!" }), { status: 400 });
    }
    if (!userEmail) {
      const user = new User({ email, name, profilePic, userId });
      await user.save();
    }
    await getAndSetAvatarDp(name, profilePic);
    const { msg, status } = await sendOtp(email, name);
    cookieStore.set("email", JSON.stringify({ email, name }));
    return new Response(JSON.stringify({ msg }), { status });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try again" }), { status: 500 });
  }
}
