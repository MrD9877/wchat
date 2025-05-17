import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the chat page subdocument
export interface ChatPage {
  chatId: string;
  lastMessage: {
    date: Date;
    message: string;
  };
  newMessages: number;
  date: Date;
}

// Define the main user schema interface
export interface IChatPages extends Map<string, ChatPage> {}

export type Usertype = {
  email: string;
  userId: string;
  name: string;
  profilePic: string;
  friends: Array<{
    name: string;
    email: string;
    userId: string;
  }>;
  subscribe: any; // You can further type this if needed
  friendRequests: any[]; // You can type this more specifically if needed
  friendRequestSend: string[];
  chatPages: IChatPages;
};
export interface IUser extends Document, Usertype {}
// Define the schema for the user
const userSchema = new Schema<Usertype & Document>({
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  userId: { type: Schema.Types.String },
  name: {
    type: Schema.Types.String,
  },
  profilePic: {
    type: Schema.Types.String,
  },
  friends: [
    {
      name: { type: Schema.Types.String },
      email: { type: Schema.Types.String },
      userId: { type: Schema.Types.String },
    },
  ],
  subscribe: {
    type: Schema.Types.Mixed,
  },
  friendRequests: [{ type: Schema.Types.Mixed }],
  friendRequestSend: [{ type: Schema.Types.String }],
  chatPages: {
    type: Map,
    of: new Schema<ChatPage>({
      chatId: {
        type: Schema.Types.String,
        required: true,
      },
      lastMessage: {
        date: { type: Schema.Types.Date },
        message: { type: Schema.Types.String },
      },
      newMessages: {
        type: Schema.Types.Number,
        default: 0,
      },
      date: {
        type: Schema.Types.Date,
      },
    }),
    default: {},
  },
});

// Define a text index on email and name
userSchema.index({ email: "text", name: "text" });

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export { UserModel as User };
