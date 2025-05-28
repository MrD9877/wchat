// distinct
import dbConnect from "../../lib/DbConnect";
import { EmotesModel } from "../../model/Emotes";

export async function GET() {
  await dbConnect();
  try {
    const group = await EmotesModel.distinct("groupName");
    return new Response(JSON.stringify({ group }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
