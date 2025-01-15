import jwt from "jsonwebtoken";
import { Session } from "../model/session";
import { keys } from "@/lib/keys";

export async function sessionAuth(token) {
  const sessionId = jwt.verify(token, process.env.LOCAL_SECRET, (err, data) => {
    if (err) return keys.ERROR;
    return data;
  });
  if (sessionId && sessionId.sessionId) {
    try {
      const data = await Session.findById(sessionId.sessionId);
      return { previousSessionId: sessionId.sessionId, sessionData: data.sessionData };
    } catch {
      return keys.ERROR;
    }
  } else {
    return keys.ERROR;
  }
}

export function tokenAuth(token) {
  return jwt.verify(token, process.env.LOCAL_SECRET, (err, data) => {
    if (err) return keys.ERROR;
    return data;
  });
}
