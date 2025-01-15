import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { cookies } from "next/headers";

export async function POST(req, res) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await req.json();
  const { email } = body;
  const data = tokenAuth(cookieStore.get("accessToken").value);
  try {
    const newFriend = await User.findOne({ email: email });
    const userInfo = await User.findOne({ email: data.user.email });
    if (!userInfo) throw new Error("error");
    if (!newFriend || email === data.user.email) return new Response(JSON.stringify({ msg: "No such user found" }), { status: 400 });
    if (newFriend.friendRequestSend.includes(data.user.email)) return new Response(JSON.stringify({ msg: "Other party has already send you a friend request please accept!" }), { status: 400 });
    if (userInfo.friendRequestSend.includes(email)) return new Response(JSON.stringify({ msg: "Request already sent" }), { status: 400 });
    if (userInfo.friends.some((item) => item.email === data.user.email)) return new Response(JSON.stringify({ msg: "You are already friends with this user!" }), { status: 400 });
    const user = await User.updateOne(
      { email: email },
      {
        $push: {
          friendRequests: {
            email: data.user.email,
            name: data.user.name,
            profilePic: data.user.profilePic,
          },
        },
      }
    );
    const newRequest = await User.updateOne({ email: data.user.email }, { $push: { friendRequestSend: email } });
    if (!user.acknowledged || !newRequest.acknowledged) {
      return new Response(JSON.stringify({ msg: "error" }), { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  return new Response(JSON.stringify({ msg: `Friend request send to ${email}` }), { status: 200 });
}
