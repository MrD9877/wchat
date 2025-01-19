// distinct
import dbConnect from "../../lib/DbConnect";
import { Emotes } from "../../model/Emotes";

export async function GET(req) {
  await dbConnect();
  try {
    const group = await Emotes.distinct("groupName");
    return new Response(JSON.stringify({ group }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
