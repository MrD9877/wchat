import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { authenticate } from "@/app/(backend)/utility/authUser";
import { cookies } from "next/headers";

export async function POST(req, res) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await req.json();
  const { email } = body;
  const token = await authenticate(cookieStore);
  console.log(token);

  console.log(token);
  if (!token) {
    return new Response(JSON.stringify({ msg: "Unauthorize" }), { status: 401 });
  }
  const { user } = token;
  try {
    const newFriend = await User.findOne({ email: email });
    const userInfo = await User.findOne({ email: user.email });
    if (!userInfo) throw new Error("error");
    if (!newFriend || email === user.email) return new Response(JSON.stringify({ msg: "No such user found" }), { status: 400 });
    if (newFriend.friendRequestSend.includes(user.email)) return new Response(JSON.stringify({ msg: "Other party has already send you a friend request please accept!" }), { status: 400 });
    if (userInfo.friendRequestSend.includes(email)) return new Response(JSON.stringify({ msg: "Request already sent" }), { status: 400 });
    if (userInfo.friends.some((item) => item.email === user.email)) return new Response(JSON.stringify({ msg: "You are already friends with this user!" }), { status: 400 });
    const updateUser = await User.updateOne(
      { email: email },
      {
        $push: {
          friendRequests: {
            email: user.email,
            name: user.name,
            profilePic: user.profilePic,
          },
        },
      }
    );
    const newRequest = await User.updateOne({ email: user.email }, { $push: { friendRequestSend: email } });
    if (!updateUser.acknowledged || !newRequest.acknowledged) {
      return new Response(JSON.stringify({ msg: "error" }), { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  return new Response(JSON.stringify({ msg: `Friend request send to ${email}` }), { status: 200 });
}
