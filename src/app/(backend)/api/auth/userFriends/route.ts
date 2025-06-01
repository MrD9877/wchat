import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { FriendInfo } from "@/hooks/useFriendAndRequests";
import { cookies } from "next/headers";

export type FriendServerInfo = Omit<FriendInfo, "publicKey"> & { publicKey: string };

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies();
  const data = await tokenAuth(cookieStore.get("accessToken")?.value || "");
  try {
    if (!data) return new Response(JSON.stringify({ msg: "unauthorized" }), { status: 401 });
    const { user } = data;
    const userInfo = await User.findOne({ email: user.email }, { friends: 1, friendRequests: 1, _id: 0 });
    if (!userInfo) throw Error();
    let friends: FriendServerInfo[] | null = null;
    const arr = userInfo.friends;

    for (let i = 0; i < arr.length; i++) {
      const userId = arr[i].userId;
      const info = await User.findOne({ userId }, { userId: 1, email: 1, _id: 0, name: 1, profilePic: 1, publicKey: 1 });
      if (info && friends) {
        friends.push(info);
      } else if (info) {
        friends = [info];
      }
    }
    const requests = userInfo.friendRequests;
    return new Response(JSON.stringify({ friends, requests }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
export async function POST(req: Request) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await req.json();
  const data = await tokenAuth(cookieStore.get("accessToken")?.value || "");
  try {
    if (!data) return new Response(JSON.stringify({ msg: "unauthorized" }), { status: 401 });
    if (!body.userId) throw Error("userId of friend required");
    const { user } = data;
    const userInfo = await User.findOne({ email: user.email }, { friends: 1 });
    const friendInfo = await User.findOne({ userId: body.userId }, { userId: 1, email: 1, _id: 0, name: 1, profilePic: 1, publicKey: 1 });
    if (!userInfo || !friendInfo) throw Error("User Not found");
    return new Response(JSON.stringify({ userId: friendInfo.userId, email: friendInfo.email, name: friendInfo.name, profilePic: friendInfo.profilePic, publicKey: friendInfo.publicKey }), { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return new Response(JSON.stringify({ msg: err.message }), { status: 400 });
    } else {
      return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
    }
  }
}
