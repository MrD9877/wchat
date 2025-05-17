import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for chat message
export interface StoredChats {
  user: string;
  date: Date;
  message: string;
  isImage: boolean;
}

export type Chats = { date: Date; chat: StoredChats[] }[];

// Define the interface for the chat page
interface IChats extends Document {
  chatId: string;
  chats: Chats;
  imagesUrl: Array<{
    imageId: string;
    url: string;
    dateGenerated: Date;
  }>;
}
// Define the schema for the chat page
const chatsSchema = new Schema<IChats>({
  chatId: {
    type: Schema.Types.String,
    required: true,
  },
  chats: [
    {
      date: { type: Schema.Types.Date, required: true },
      chat: [
        {
          user: {
            type: Schema.Types.String,
            required: true,
          },
          date: {
            type: Schema.Types.Date,
            required: true,
          },
          message: {
            type: Schema.Types.String,
            required: true,
          },
          media: {
            mediaType: {
              type: Schema.Types.String,
              default: "text",
            },
            id: {
              type: Schema.Types.String,
              require: true,
            },
          },
        },
      ],
    },
  ],
});

// Create and export the model
export const ChatPage: Model<IChats> = mongoose.models.ChatPage || mongoose.model<IChats>("ChatPage", chatsSchema);
