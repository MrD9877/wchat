import { cookies } from "next/headers";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { sendOtp } from "../../utility/sendOtp";

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const cookieStore = await cookies();
  const { email } = body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return new Response(JSON.stringify({ msg: "Register your account" }), { status: 302 });
    }
    const { msg, status } = await sendOtp(email, checkUser.name);
    cookieStore.set("email", JSON.stringify({ email, name: checkUser.name }));
    return new Response(JSON.stringify({ msg }), { status });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal server error" }), { status: 500 });
  }
}
