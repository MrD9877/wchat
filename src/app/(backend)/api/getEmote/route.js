import { Verify } from "../../model/verify";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken, generateSession } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { Emotes } from "../../model/Emotes";

export async function POST(req) {
  await dbConnect();
  const { groupName } = await req.json();
  if (!groupName) return new Response(JSON.stringify({ msg: "no data found" }), { status: 400 });
  try {
    const emotes = await Emotes.findOne({ groupName: groupName });
    return new Response(JSON.stringify({ emotes }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
