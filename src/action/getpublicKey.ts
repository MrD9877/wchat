"use server";

import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";

export async function getPublicKey(userId: string) {
  await dbConnect();
  try {
    const user = await User.findOne({ userId });
    console.log(user);
    console.log(user?.publicKey);
    if (!user) throw Error();
    return user?.publicKey;
  } catch {
    return false;
  }
}
