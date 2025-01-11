import { Session } from "../model/session";
import { sessionAuth } from "./authToken";

export async function clearSession(req) {
  const session = req.cookies.get("session");
  if (!session) return { msg: "No session found", status: 400 };
  const { sessionData, previousSessionId } = await sessionAuth(session.value);
  try {
    await Session.deleteOne({ _id: previousSessionId });
    return { msg: "clear", status: 200 };
  } catch {
    return { msg: "Internal Server Error", status: 500 };
  }
}
