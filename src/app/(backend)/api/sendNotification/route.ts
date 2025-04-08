import dbConnect from "../../lib/DbConnect";
import { sendNotification } from "../../utility/sendNotification";

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  // await sendNotification(body.data);
  return new Response(JSON.stringify({ msg: "Bad request: Email not found" }), { status: 200 });
}
