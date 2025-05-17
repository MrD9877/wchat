import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const data = await AuthRequest();
  const { newName }: { newName: string } = body;

  try {
    if (!data) return new Response(JSON.stringify({ msg: "Please login to continue.." }), { status: 401 });
    const change = await User.updateOne({ email: data.user.email }, { $set: { name: newName } });
    if (change.acknowledged) {
      return new Response(JSON.stringify({ msg: "Successfull name changed" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ msg: "Somthing went wrong" }), { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
