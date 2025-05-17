import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    files: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        originalName: { type: String },
        fileType: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        status: { type: String, default: "processing" },
        summaryFileName: { type: String },
        summaryUrl: { type: String },
        summary: { type: String },
        summaryGeneratedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const user = model("User", userSchema);
export default user;
