import { Verify } from "../model/verify";

export async function sendOtp(email, req) {
  const otp = Math.floor(Math.random() * 10000) - 1;
  const pastVerification = await Verify.findOne({ user: email });
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);
  if (pastVerification) {
    const diff = Date.now() - pastVerification.expiresAt.getTime();
    if (diff < 2000) {
      return { msg: "Otp already send", status: 409 };
    } else {
      const pastVerification = await Verify.updateOne({ user: email }, { $set: { user: email, otp, expiresAt } }, { upsert: false, multi: false });
      if (!pastVerification.acknowledged) {
        return { msg: "Internal Server Error Try again", status: 500 };
      }
    }
  } else {
    const optVerify = new Verify({ user: email, otp, expiresAt });
    await optVerify.save();
  }
  return { msg: "Created", status: 201 };
}
