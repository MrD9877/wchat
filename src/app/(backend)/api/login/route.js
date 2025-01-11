import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { sendOtp } from "../../utility/sendOtp";

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { email } = body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return new Response(JSON.stringify({ msg: "Register your account" }), { status: 400 });
    }
    const { msg, status } = await sendOtp(email);
    return new Response(JSON.stringify({ msg }), { status });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal server error" }, { status: 500 }));
  }
}
