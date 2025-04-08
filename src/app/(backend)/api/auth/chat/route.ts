import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { cookies } from "next/headers";

function areSameDayUTC(date1: Date, date2: Date) {
  const d1 = new Date(Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate()));
  const d2 = new Date(Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate()));

  return d1.getTime() === d2.getTime();
}

export async function POST(req: Request) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await req.json();
  const { friend, content } = body;
  let chatId;
  const data = await tokenAuth(cookieStore.get("accessToken").value);
  try {
    if (!data) throw Error();
    const { user } = data;
    const userInfo = await User.findOne({ email: user, "friends.email": friend }, { "friends.$": 1 });
    if (!userInfo) return new Response(JSON.stringify({ msg: "You are not a registered user!!" }), { status: 400 });
    chatId = userInfo.friends[0].userId;

    const date = new Date();
    const findchat = await ChatPage.findOne({ chatId });
    if (!findchat) {
      const message = new ChatPage({ chatId, chats: [{ date, chat: [{ date, content, user }] }] });
      await message.save();
    } else {
      const lastDate = findchat.chats.length - 1;
      const sameDay = areSameDayUTC(findchat.chats[lastDate].date, date);
      if (sameDay) {
        const message = await ChatPage.updateOne({ chatId, "chats.date": findchat.chats[lastDate].date }, { $push: { "chats.$.chat": { content, user, date } } });
        if (!message.acknowledged) throw Error();
      } else {
        const message = await ChatPage.updateOne({ chatId }, { $push: { chats: { date, chat: { content, user, date } } } });
        if (!message.acknowledged) throw Error();
      }
    }
    return new Response(JSON.stringify({ status: 200 }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
