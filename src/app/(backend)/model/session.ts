import mongoose, { Schema, Document } from "mongoose";

interface Session {
  sessionData: any;
  expiresAt: Date;
}

const sessionSchema = new Schema<Session>({
  sessionData: {
    type: Schema.Types.Mixed,
  },
  expiresAt: { type: Date, required: true },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

export const Session = mongoose.models.Session || mongoose.model<Document & Session>("Session", sessionSchema);
