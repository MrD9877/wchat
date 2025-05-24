import { NextResponse } from "next/server";
import { getAndSetAvatarDp } from "../../utility/setInitialAvatar";

export async function GET(req: Request) {
  const result = await getAndSetAvatarDp("js", "test2");
  return new NextResponse(JSON.stringify({ result }), { status: 200 });
}
