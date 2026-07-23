import { Schema, model, Document, Types } from "mongoose";

export interface RefreshTokenDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  deviceInfo?: string;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  deviceInfo: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// TTL index — MongoDB automatically deletes the document once expiresAt passes.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema);
