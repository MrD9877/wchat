import dbConnect from "../../lib/DbConnect";
import { EmotesModel } from "../../model/Emotes";

export async function POST(req: Request) {
  await dbConnect();
  const { obj, key, query } = await req.json();
  if (key !== "key") return new Response(JSON.stringify({ msg: "Invalid key" }), { status: 401 });
  if (!obj) return new Response(JSON.stringify({ msg: "no data found" }), { status: 400 });
  try {
    const emotesArray = obj.map((emote: { unicodeName: string; character: string }) => {
      return { name: emote.unicodeName, character: emote.character };
    });
    const emotes = new EmotesModel({ groupName: query, emotesArray });
    await emotes.save();
    return new Response(JSON.stringify({ msg: "done" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
