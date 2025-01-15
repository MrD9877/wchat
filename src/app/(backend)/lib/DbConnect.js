import mongoose from "mongoose";
export const config = {
  runtime: "nodejs", // Specify Node.js runtime here
};

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect("mongodb+srv://dhuruvbansl99:Shubham123@cluster0.jos6q.mongodb.net/wechat");
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (e) {
    console.log(e);
    process.exit();
    // return new Response("Internal Server Error", { status: 500 });
  }
}

export default dbConnect;
