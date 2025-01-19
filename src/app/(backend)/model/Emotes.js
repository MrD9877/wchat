import mongoose from "mongoose";
const { Schema } = mongoose;

const EmoteSchema = new Schema({
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

export const Emotes = mongoose.models.Emotes || mongoose.model("Emotes", EmoteSchema);
