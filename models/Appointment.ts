import mongoose, { Schema, model, models } from "mongoose";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type RecurrenceFrequency = "none" | "daily" | "weekly" | "biweekly" | "monthly";

export interface IAppointment {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  isWalkIn: boolean;
  recurrence: {
    frequency: RecurrenceFrequency;
    endDate?: Date;
    interval?: number;
  };
  notes?: string;
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
      default: "scheduled",
    },
    isWalkIn: { type: Boolean, default: false },
    recurrence: {
      frequency: {
        type: String,
        enum: ["none", "daily", "weekly", "biweekly", "monthly"],
        default: "none",
      },
      endDate: Date,
      interval: { type: Number, default: 1 },
    },
    notes: String,
    reminderSent: Boolean,
  },
  { timestamps: true }
);

AppointmentSchema.index({ staffId: 1, startTime: 1 });
AppointmentSchema.index({ customerId: 1, startTime: 1 });
AppointmentSchema.index({ startTime: 1, status: 1 });

export default models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);
