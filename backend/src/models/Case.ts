import mongoose, { Schema, Document } from "mongoose";

export interface ICase extends Document {
  caseTitle: string;
  clientName: string;
  courtName: string;
  caseType: string;
  nextHearingDate: Date;
  stage: "Filing" | "Evidence" | "Arguments" | "Order Reserved";
  notes?: string;
}

const CaseSchema: Schema = new Schema(
  {
    caseTitle: { type: String, required: true, minlength: 3 },
    clientName: { type: String, required: true },
    courtName: { type: String, required: true },
    caseType: { type: String, required: true },
    nextHearingDate: { type: Date, required: true },
    stage: {
      type: String,
      required: true,
      enum: ["Filing", "Evidence", "Arguments", "Order Reserved"],
    },
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);

export default mongoose.model<ICase>("Case", CaseSchema);
