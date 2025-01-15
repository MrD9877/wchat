import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { userId } = body;
  try {
    const findUser = await User.findOne({ userId });
    if (!findUser) {
      return new Response(JSON.stringify({ msg: "Register your account" }), { status: 400 });
    }
    const data = { userId: userId, name: findUser.name, email: findUser.email, profilePic: findUser.profilePic };
    return new Response(JSON.stringify({ ...data }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal server error" }, { status: 500 }));
  }
}
