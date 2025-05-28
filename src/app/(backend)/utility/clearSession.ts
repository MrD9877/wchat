import { Session } from "../model/session";
import { sessionAuth } from "./authToken";
type TODO = any;
export async function clearSession(req: TODO) {
  const session = req.cookies.get("session");
  if (!session) return { msg: "No session found", status: 400 };
  const data = await sessionAuth(session.value);
  try {
    if (!data) throw Error();
    const { previousSessionId } = data;
    await Session.deleteOne({ _id: previousSessionId });
    return { msg: "clear", status: 200 };
  } catch {
    return { msg: "Internal Server Error", status: 500 };
  }
}
