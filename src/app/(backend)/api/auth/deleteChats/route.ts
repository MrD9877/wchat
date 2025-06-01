import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";

export async function POST(req: Request) {
  dbConnect();
  const chatIds: string[] = await req.json();
  try {
    if (!chatIds) throw Error();
    const chatsDeleted = await ChatPage.deleteMany({ chatId: { $in: chatIds } });
    return new Response(JSON.stringify(chatsDeleted), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
