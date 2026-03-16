import mongoose, { Schema, model, models } from "mongoose";

export interface IStaff {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: string;
  commissionPercent: number;
  baseSalary?: number;
  services: mongoose.Types.ObjectId[]; // service IDs they can perform
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: "Stylist" },
    commissionPercent: { type: Number, default: 0 },
    baseSalary: Number,
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Staff || model<IStaff>("Staff", StaffSchema);
