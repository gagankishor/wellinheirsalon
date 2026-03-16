import mongoose, { Schema, model, models } from "mongoose";

export interface ICustomer {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  birthday?: Date;
  anniversary?: Date;
  preferredStaffId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    birthday: Date,
    anniversary: Date,
    preferredStaffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    notes: String,
  },
  { timestamps: true }
);

export default models.Customer || model<ICustomer>("Customer", CustomerSchema);
