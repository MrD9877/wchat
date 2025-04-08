import dbConnect from "../../lib/DbConnect";
import { Emotes } from "../../model/Emotes";
import { sendEmail } from "../../utility/sendEmail";

export async function POST(req: Request) {
  await dbConnect();
  const { email, name, otp } = await req.json();
  try {
    const send = await sendEmail(otp, name, email);
    if (!send) throw Error();
    return new Response(JSON.stringify({ msg: send }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
