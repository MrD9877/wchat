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
    if (!newFriend || email === data.user) return new Response(JSON.stringify({ msg: "No such user found" }, { status: 400 }));
    if (newFriend.friendRequests.includes(data.user)) return new Response(JSON.stringify({ msg: "Request already sent" }, { status: 400 }));
    const matchFriend = newFriend.friends.forEach((friend) => {
      if (friend.email === email) return true;
    });
    if (matchFriend) return new Response(JSON.stringify({ msg: "Already friends" }, { status: 400 }));
    if (newFriend.friendRequestSend.includes(email)) return new Response(JSON.stringify({ msg: "User you are tring to friend has already send you request please accept" }, { status: 409 }));
    const user = await User.updateOne({ email: email }, { $push: { friendRequests: data.user } });
    const newRequest = await User.updateOne({ email: data.user }, { $push: { friendRequestSend: email } });
    if (!user.acknowledged || !newRequest.acknowledged) {
      return new Response(JSON.stringify({ msg: "error" }, { status: 400 }));
    }
  } catch {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }, { status: 500 }));
  }
  return new Response(JSON.stringify({ msg: `Friend request send to ${email}` }, { status: 200 }));
}
