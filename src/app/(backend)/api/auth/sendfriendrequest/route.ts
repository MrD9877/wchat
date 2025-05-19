import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";
import { sendInAppNotification } from "@/app/(backend)/utility/sendInAppNotification";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { email } = body;
  const data = await AuthRequest();

  try {
    if (!data) return new Response(JSON.stringify({ msg: "Login to continue" }), { status: 401 });
    const { user } = data;
    const newFriend = await User.findOne({ email: email });
    const userInfo = await User.findOne({ email: user.email });
    if (!userInfo) throw new Error("error");
    if (!newFriend || email === user.email) return new Response(JSON.stringify({ msg: "No such user found" }), { status: 400 });
    if (newFriend.friendRequestSend.includes(user.email)) return new Response(JSON.stringify({ msg: "Other party has already send you a friend request please accept!" }), { status: 400 });
    if (newFriend.friendRequests.includes(email)) return new Response(JSON.stringify({ msg: "Request already sent" }), { status: 400 });
    if (userInfo.friends.some((item) => item.userId === newFriend.userId)) return new Response(JSON.stringify({ msg: "You are already friends with this user!" }), { status: 400 });
    const updateUser = await User.updateOne(
      { email: email },
      {
        $push: {
          friendRequests: {
            email: user.email,
            name: user.name,
            profilePic: user.profilePic,
            userId: user.userId,
          },
        },
      }
    );
    const newRequest = await User.updateOne({ email: user.email }, { $push: { friendRequestSend: email } });
    if (!updateUser.acknowledged || !newRequest.acknowledged) {
      return new Response(JSON.stringify({ msg: "error" }), { status: 400 });
    }
    await sendInAppNotification({ userId: newFriend.userId, notification: { from: user.userId }, type: "friend Request" });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  return new Response(JSON.stringify({ msg: `Friend request send to ${email}` }), { status: 200 });
}
