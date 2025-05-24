"use server";
import Content from "@/components/OTPEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendEmail(otp: string, userName: string, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "hindsApp@jagraongarments.in",
      to: email,
      subject: "Email Verify",
      react: Content({ otp, userName }),
    });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
