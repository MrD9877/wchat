import mongoose, { Schema, Document, Model } from "mongoose";
interface EmotesArray {
  name: string;
  character: string;
}

interface Emotes {
  groupName: string;
  emotesArray: EmotesArray[];
}
export interface IEmotes extends Document, Emotes {}
const EmoteSchema = new Schema<Emotes>({
  groupName: {
    type: Schema.Types.String,
    require: true,
  },
  emotesArray: [
    {
      name: {
        type: Schema.Types.String,
        require: true,
      },
      character: {
        type: Schema.Types.String,
        require: true,
      },
    },
  ],
});

const EmotesModel: Model<IEmotes> = mongoose.models.Emotes || mongoose.model<IEmotes>("Emotes", EmoteSchema);
export { EmotesModel as Emotes };
