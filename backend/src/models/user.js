import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

export default mongoose.model("User", userSchema);
