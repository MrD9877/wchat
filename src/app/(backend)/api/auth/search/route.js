import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { authenticate } from "@/app/(backend)/utility/authUser";
import { keys } from "@/lib/keys";
import { cookies } from "next/headers";

export async function POST(req, res) {
  await dbConnect();
  const body = await req.json();
  const cookieStore = await cookies();
  const token = await authenticate(cookieStore);

  console.log(token);
  if (token == keys.UNAUTHORIZED) {
    return new Response(JSON.stringify({ msg: "Unauthorize" }), { status: 401 });
  }
  const { user } = token;
  const { search } = body;
  try {
    const userInfo = await User.findOne({ email: user.email });
    if (!search || search === "" || typeof search !== "string") return new Response(JSON.stringify({ msg: "Please enter valid search string" }), { status: 400 });
    const findUser = await User.find({ $text: { $search: search } });
    const users = findUser.map((user) => {
      const friend = userInfo.friends.some((item) => item.email === user.email);

      return { email: user.email, name: user.name, friend };
    });
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
