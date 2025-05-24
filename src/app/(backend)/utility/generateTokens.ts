"use server";
import jwt from "jsonwebtoken";
import { Session } from "../model/session";
import { sessionAuth } from "./authToken";
import dotenv from "dotenv";
dotenv.config();

export interface TokenDataUser {
  userId: string;
  name: string;
  email: string;
  profilePic: string;
}

export function generateAccessToken(user: TokenDataUser, expiresIn: number) {
  try {
    return jwt.sign({ user }, process.env.LOCAL_SECRET || "", { expiresIn });
  } catch {
    return false;
  }
}
export function generateRefreshToken(user: TokenDataUser) {
  try {
    return jwt.sign({ user }, process.env.LOCAL_SECRET || "", { expiresIn: "100d" });
  } catch {
    return false;
  }
}

export async function generateSession(data: any, req: any) {
  let token;
  let sessionId;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 84);
  try {
    const previousSession = req.cookies.get("session");
    const getSession = previousSession ? await sessionAuth(previousSession.value) : false;
    if (!getSession) throw Error();
    const { sessionData, previousSessionId } = getSession;
    if (sessionData && sessionData !== "_error") {
      const session = await Session.updateOne({ _id: previousSessionId }, { $set: { sessionData: { ...sessionData, ...data }, expiresAt } }, { upsert: false, multi: false });
      if (!session.acknowledged) throw new Error("Error");
      sessionId = previousSession;
    } else {
      const session = new Session({ sessionData: { ...data }, expiresAt });
      const save = await session.save();
      sessionId = save._id.toString();
    }
    return jwt.sign({ sessionId }, process.env.LOCAL_SECRET || "", { expiresIn: "100d" });
  } catch (err) {
    console.log(err);
    return (token = "_error");
  }
}
