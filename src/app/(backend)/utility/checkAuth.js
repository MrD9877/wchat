import dbConnect from "../lib/DbConnect";

export async function checkAuth(req) {
  await dbConnect();
}
