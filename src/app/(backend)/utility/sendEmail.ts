"use server";
import Content from "@/app/_email/OTPEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(otp: string, userName: string, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "shubhambansal1235@gmail.com",
      subject: "Your OTP Code",
      react: Content({ otp, userName }),
      text: `Hi ${userName} your otp for email ${email} is ${otp}`,
    });

    if (error) {
      throw Error(error.message);
    }

    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
