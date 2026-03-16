import mongoose, { Schema, model, models } from "mongoose";

export interface IService {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: String,
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true },
    category: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Service || model<IService>("Service", ServiceSchema);
