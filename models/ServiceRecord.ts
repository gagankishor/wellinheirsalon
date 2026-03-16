import mongoose, { Schema, model, models } from "mongoose";

// Links completed appointments to customer service history (for reporting & preferred stylist)
export interface IServiceRecord {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  amount: number;
  commissionAmount?: number;
  completedAt: Date;
  createdAt: Date;
}

const ServiceRecordSchema = new Schema<IServiceRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    amount: { type: Number, required: true },
    commissionAmount: Number,
    completedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

ServiceRecordSchema.index({ customerId: 1, completedAt: -1 });
ServiceRecordSchema.index({ staffId: 1, completedAt: -1 });

export default models.ServiceRecord || model<IServiceRecord>("ServiceRecord", ServiceRecordSchema);
