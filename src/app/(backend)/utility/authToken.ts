"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Session } from "../model/session";

export async function sessionAuth(token: string): Promise<JwtPayload | false> {
  try {
    const sessionId = jwt.verify(token, process.env.LOCAL_SECRET || "") as JwtPayload;
    if (sessionId && !sessionId.sessionId) throw Error("");
    const data = await Session.findById(sessionId.sessionId);
    return { previousSessionId: sessionId.sessionId, sessionData: data.sessionData };
  } catch {
    return false;
  }
}

export async function tokenAuth(token: string): Promise<JwtPayload | false> {
  try {
    return jwt.verify(token, process.env.LOCAL_SECRET || "") as JwtPayload;
  } catch {
    return false;
  }
}
