import mongoose, { Schema, Document, Model } from "mongoose";

interface Verify {
  user: string;
  otp: number;
  expiresAt: Date;
}
export interface IVerify extends Document, Verify {}

const veriftSchema = new Schema<Verify>({
  user: {
    type: Schema.Types.String,
    required: true,
  },
  otp: {
    type: Schema.Types.Number,
    required: true,
  },
  expiresAt: { type: Date, required: true },
});

veriftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

const VerifyModel: Model<IVerify> = mongoose.models.User || mongoose.model<IVerify>("Verify", veriftSchema);
export { VerifyModel as Verify };
