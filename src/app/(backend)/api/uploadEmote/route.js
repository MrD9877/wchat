import { Verify } from "../../model/verify";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken, generateSession } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { Emotes } from "../../model/Emotes";

export async function POST(req) {
  await dbConnect();
  const { obj, key, query } = await req.json();
  if (key !== "key") return new Response(JSON.stringify({ msg: "Invalid key" }), { status: 401 });
  if (!obj) return new Response(JSON.stringify({ msg: "no data found" }), { status: 400 });
  try {
    // console.log(sub);
    const emotesArray = obj.map((emote) => {
      return { name: emote.unicodeName, character: emote.character };
    });
    const emotes = new Emotes({ groupName: query, emotesArray });
    await emotes.save();
    return new Response(JSON.stringify({ msg: "done" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
