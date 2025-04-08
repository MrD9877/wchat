import mongoose, { ConnectionStates } from "mongoose";
export const config = {
  runtime: "nodejs", // Specify Node.js runtime here
};

const connection: { isConnected: ConnectionStates | false } = { isConnected: false };
const MongoDbString = process.env.MONGO_DB_STRING;

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  try {
    if (!MongoDbString) throw Error("no db string");
    const db = await mongoose.connect(MongoDbString);
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (e) {
    console.log(e);
    process.exit();
    // return new Response("Internal Server Error", { status: 500 });
  }
}

export default dbConnect;
