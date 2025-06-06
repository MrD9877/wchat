import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";

export async function POST(req: Request) {
  dbConnect();
  const chatId = await req.json();
  try {
    if (!chatId) throw Error();
    const chats = await ChatPage.findOne({ chatId });
    await ChatPage.deleteOne({ chatId });
    return new Response(JSON.stringify({ ...chats }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
