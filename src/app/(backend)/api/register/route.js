import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { sendOtp } from "../../utility/sendOtp";

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { email } = body;
  try {
    const userEmail = await User.findOne({ email });
    console.log(userEmail);
    if (userEmail && userEmail.isVarified) {
      return new Response(JSON.stringify({ msg: "This email is Already has a account please Login!" }), { status: 400 });
    }
    if (!userEmail) {
      const user = new User({ email });
      await user.save();
    }
    const { msg, status } = await sendOtp(email);
    return new Response(JSON.stringify({ msg }), { status });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try again" }), { status: 500 });
  }
}
