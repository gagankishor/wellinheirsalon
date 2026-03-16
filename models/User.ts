import mongoose, { Schema, model, models } from "mongoose";

export type UserRole = "super_admin" | "staff";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;
  staffId?: mongoose.Types.ObjectId; // for role === "staff"
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "staff"], required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
