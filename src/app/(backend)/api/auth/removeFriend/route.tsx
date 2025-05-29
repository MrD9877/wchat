import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { userId } = body;
  const data = await AuthRequest();

  try {
    if (!data) return new Response(JSON.stringify({ msg: "Login to continue" }), { status: 401 });
    const { user } = data;
    const updateFriend = await User.updateOne(
      { userId },
      {
        $pull: {
          friends: {
            userId: user.userId,
          },
        },
      }
    );
    const updateUser = await User.updateOne(
      { userId: user.userId },
      {
        $pull: {
          friends: {
            userId,
          },
        },
      }
    );

    if (!updateFriend.acknowledged || !updateUser.acknowledged) {
      return new Response(JSON.stringify({ msg: "error" }), { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  return new Response(JSON.stringify({ msg: `Friend removed` }), { status: 200 });
}
