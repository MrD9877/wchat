import dbConnect from "@/app/(backend)/lib/DbConnect";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";
import { uploadImage } from "@/app/(backend)/utility/awsBucket";

export async function GET() {
  await dbConnect();
  console.log("here");
  const data = await AuthRequest();

  try {
    if (!data) return new Response(JSON.stringify({ msg: "Please login to continue.." }), { status: 401 });
    const url = await uploadImage(data.user.profilePic);
    console.log(url);
    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
