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
    const newFriend = await User.findOne({ email: email });
    if (!newFriend) return new Response(JSON.stringify({ msg: "No such user found" }), { status: 400 });
    const userInfo = await User.findOne({ email: data.user.email });
    if (!userInfo || (userInfo && !userInfo.friendRequests.some((item) => item.email === email))) return new Response(JSON.stringify({ msg: "No such request found to process" }), { status: 400 });
    const updateRequest = await User.updateOne({ email: data.user.email }, { $push: { friends: { userId: newFriend.userId } }, $pull: { friendRequests: { email } } });
    const updateOthersideRequest = await User.updateOne({ email: email }, { $push: { friends: { userId: userInfo.userId } }, $pull: { friendRequestSend: data.user.email } });
    if (!updateRequest.acknowledged || !updateOthersideRequest.acknowledged) return new Response(JSON.stringify({ msg: "No request from this user found" }), { status: 400 });
    await sendInAppNotification({ userId: newFriend.userId, notification: { from: userInfo.userId }, type: "friend request accepted" });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  return new Response(JSON.stringify({ msg: `Friend request send to ${email}` }), { status: 200 });
}
