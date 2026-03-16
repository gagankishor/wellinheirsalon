import mongoose, { Schema, model, models } from "mongoose";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type LeaveType = "sick" | "casual" | "annual" | "unpaid" | "other";

export interface ILeave {
  _id: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new Schema<ILeave>(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    type: {
      type: String,
      enum: ["sick", "casual", "annual", "unpaid", "other"],
      default: "casual",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

LeaveSchema.index({ staffId: 1, startDate: 1 });

export default models.Leave || model<ILeave>("Leave", LeaveSchema);
