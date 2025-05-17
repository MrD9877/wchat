import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { email } = body;
  const data = await AuthRequest();
  try {
    if (!data) throw Error();
    const newFriend = await User.findOne({ email: email });
    if (!newFriend) return new Response(JSON.stringify({ msg: "No such user found" }), { status: 400 });
    const userInfo = await User.findOne({ email: data.user.email });
    if (!userInfo || (userInfo && !userInfo.friendRequests.some((item) => item.email === email))) return new Response(JSON.stringify({ msg: "No such request found to process" }), { status: 400 });
    const updateRequest = await User.updateOne({ email: data.user.email }, { $push: { friends: { email: email, name: newFriend.name, userId: newFriend.userId } }, $pull: { friendRequests: { email } } });
    const updateOthersideRequest = await User.updateOne({ email: email }, { $push: { friends: { email: data.user.email, name: data.user.name, userId: userInfo.userId } }, $pull: { friendRequestSend: data.user.email } });
    console.log(newFriend.userId, userInfo.userId);
    if (!updateRequest.acknowledged || !updateOthersideRequest.acknowledged) return new Response(JSON.stringify({ msg: "No request from this user found" }), { status: 400 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  return new Response(JSON.stringify({ msg: `Friend request send to ${email}` }), { status: 200 });
}
