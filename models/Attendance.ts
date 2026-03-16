import mongoose, { Schema, model, models } from "mongoose";

export interface IAttendance {
  _id: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: "present" | "absent" | "leave" | "half_day" | "holiday";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    date: { type: Date, required: true },
    checkIn: Date,
    checkOut: Date,
    status: {
      type: String,
      enum: ["present", "absent", "leave", "half_day", "holiday"],
      default: "present",
    },
    notes: String,
  },
  { timestamps: true }
);

AttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

export default models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);
