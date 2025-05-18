import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { Friend } from "@/app/(siteRoutes)/chatpage/[chatId]/page";
import { FriendInfo } from "@/utility/updateFriend";
import { cookies } from "next/headers";

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies();
  const data = await tokenAuth(cookieStore.get("accessToken")?.value || "");
  try {
    if (!data) return new Response(JSON.stringify({ msg: "unauthorized" }), { status: 401 });
    const { user } = data;
    const userInfo = await User.findOne({ email: user.email }, { friends: 1, friendRequests: 1, _id: 0 });
    if (!userInfo) throw Error();
    let friends: Omit<FriendInfo, "lastMessage" | "newMessages">[] | null = null;
    const arr = userInfo.friends;

    for (let i = 0; i < arr.length; i++) {
      const userId = arr[i].userId;
      const info = await User.findOne({ userId }, { userId: 1, email: 1, _id: 0, name: 1, profilePic: 1 });
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
