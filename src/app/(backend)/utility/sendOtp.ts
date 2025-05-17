import { connectRedis } from "./redis";
import { sendEmail } from "./sendEmail";

export async function sendOtp(email: string, name: string) {
  const random: number = Math.floor(Math.random() * 10000) - 1;
  const client = await connectRedis();
  try {
    const otp = random < 1000 ? `0${random}` : `${random}`;
    console.log({ otp });
    await client.connect();
    await client.setEx(`otp-${email}`, 60 * 5, otp);
    await sendEmail(otp, name, email);
    return { msg: "Created", status: 201 };
  } catch {
    return { msg: "Internal server error", status: 500 };
  } finally {
    await client.quit();
  }
}
