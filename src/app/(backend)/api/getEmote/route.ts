import dbConnect from "../../lib/DbConnect";
import { EmotesModel } from "../../model/Emotes";

export async function POST(req: Request) {
  await dbConnect();
  const { groupName } = await req.json();
  if (!groupName) return new Response(JSON.stringify({ msg: "no data found" }), { status: 400 });
  try {
    const emotes = await EmotesModel.findOne({ groupName: groupName });
    return new Response(JSON.stringify({ emotes }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
