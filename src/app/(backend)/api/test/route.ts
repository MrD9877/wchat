import dbConnect from "../../lib/DbConnect";
import { Emotes } from "../../model/Emotes";
import { connectRedis } from "../../utility/redis";
import { sendEmail } from "../../utility/sendEmail";

export async function POST(req: Request) {
  const client = await connectRedis();
  await client.connect();
  await client.set("hello", "world");
}
