import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const data = await AuthRequest();

  const { search } = body;
  try {
    if (!data) return new Response(JSON.stringify({ msg: "Login to continue" }), { status: 401 });
    const { user } = data;
    const userInfo = await User.findOne({ email: user.email });
    if (!search || search === "" || typeof search !== "string") return new Response(JSON.stringify({ msg: "Please enter valid search string" }), { status: 400 });
    const findUser = await User.find({ $text: { $search: search } });
    const users = findUser.map((user) => {
      const friend = userInfo?.friends.some((item) => item.userId === user.userId);
      return { email: user.email, name: user.name, friend, profilePic: user.profilePic };
    });
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
