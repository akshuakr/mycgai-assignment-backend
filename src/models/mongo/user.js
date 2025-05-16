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
      },
    ],
  },
  { timestamps: true }
);

const user = model("User", userSchema);
export default user;
