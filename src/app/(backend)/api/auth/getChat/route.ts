import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";

export async function POST(req: Request) {
  dbConnect();
  const body = await req.json();
  const { chatId } = body;
  console.log(chatId);
  try {
    const chats = await ChatPage.findOne({ chatId });
    return new Response(JSON.stringify({ chats }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
