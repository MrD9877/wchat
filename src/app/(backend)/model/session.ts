import mongoose, { Schema, Document } from "mongoose";

interface Session {
  sessionData: any;
  expiresAt: Date;
}
interface ISession extends Session, Document {
  chatId: string;
}

const sessionSchema = new Schema<ISession>({
  sessionData: {
    type: Schema.Types.Mixed,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

export const Session = mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
