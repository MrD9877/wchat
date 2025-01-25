import { cookies } from "next/headers";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { sendOtp } from "../../utility/sendOtp";

export async function GET(request) {
  await dbConnect();
  const cookieStore = await cookies();
  const emailCookie = cookieStore.get("email");
  let email = null;
  let name = null;
  if (emailCookie) {
    const data = JSON.parse(decodeURIComponent(emailCookie.value));
    email = data.email;
    name = data.name;
  }
  if (!email) {
    return new Response(JSON.stringify({ msg: "Bad request: Email not found" }), { status: 400 });
  }
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
