import mongoose, { Schema, Document, Model } from "mongoose";

export interface EmotesArray {
  name: string;
  character: string;
}

export interface Emotes {
  groupName: string;
  emotesArray: EmotesArray[];
}

export interface IEmotes extends Emotes, Document {}

const EmoteSchema = new Schema<IEmotes>({
  groupName: {
    type: Schema.Types.String,
    required: true, // ✅ corrected spelling from `require`
  },
  emotesArray: [
    {
      name: {
        type: Schema.Types.String,
        required: true,
      },
      character: {
        type: Schema.Types.String,
        required: true,
      },
    },
  ],
});

// ✅ Schema and Model now agree on type: IEmotes
export const EmotesModel: Model<IEmotes> = mongoose.models.Emotes || mongoose.model<IEmotes>("Emotes", EmoteSchema);
