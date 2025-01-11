import jwt from "jsonwebtoken";
import { Session } from "../model/session";

export async function sessionAuth(token) {
  const sessionId = jwt.verify(token, process.env.LOCAL_SECRET, (err, data) => {
    if (err) return "_error";
    return data;
  });
  if (sessionId && sessionId.sessionId) {
    try {
      const data = await Session.findById(sessionId.sessionId);
      return { previousSessionId: sessionId.sessionId, sessionData: data.sessionData };
    } catch {
      return "_error";
    }
  } else {
    return "_error";
  }
}

export function tokenAuth(token) {
  return jwt.verify(token, process.env.LOCAL_SECRET, (err, data) => {
    if (err) return "_error";
    return data;
  });
}
