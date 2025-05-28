import { NextResponse } from "next/server";
import { sendEmail } from "../../utility/sendEmail";

export async function GET(req: Request) {
  const data = await sendEmail("1234", "dhuruv", "shurbhambansal1235@gmail.com");
  return new NextResponse(JSON.stringify({ data }), { status: 200 });
}
