import jwt from "jsonwebtoken";
import { Session } from "../model/session";
import { sessionAuth } from "./authToken";

export function generateAccessToken(user, expiresIn) {
  return jwt.sign({ user }, process.env.LOCAL_SECRET, { expiresIn });
}
export function generateRefreshToken(user) {
  return jwt.sign({ user }, process.env.LOCAL_SECRET, { expiresIn: "100d" });
}

export async function generateSession(data, req) {
  let token;
  let sessionId;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 84);
  try {
    const previousSession = req.cookies.get("session");
    const { sessionData, previousSessionId } = previousSession ? await sessionAuth(previousSession.value) : { sessionData: null, previousSessionId: null };
    if (sessionData && sessionData !== "_error") {
      const session = await Session.updateOne({ _id: previousSessionId }, { $set: { sessionData: { ...sessionData, ...data }, expiresAt } }, { upsert: false, multi: false });
      if (!session.acknowledged) throw new Error("Error");
      sessionId = previousSession;
    } else {
      const session = new Session({ sessionData: { ...data }, expiresAt });
      const save = await session.save();
      sessionId = save._id.toString();
    }
    return jwt.sign({ sessionId }, process.env.LOCAL_SECRET, { expiresIn: "100d" });
  } catch (err) {
    console.log(err);
    return (token = "_error");
  }
}
