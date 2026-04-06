import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  caseId: mongoose.Types.ObjectId; 
  title: string;
  dueDate: Date;
  ownerName: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
}

const TaskSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    ownerName: { type: String, required: true },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
      default: "Medium", 
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Completed"],
      default: "Pending", 
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITask>("Task", TaskSchema);
