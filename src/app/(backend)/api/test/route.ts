import { NextResponse } from "next/server";
import webpush from "web-push";

export async function GET(req: Request) {
  const keys = webpush.generateVAPIDKeys();
  console.log(keys);
  return new NextResponse(JSON.stringify({ keys }), { status: 200 });
}
