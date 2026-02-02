import mongoose from "mongoose";

const guardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true }, // National ID or employee number
    phoneNumber: { type: Number, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    assignedSite: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
      hireDate: { type: Date, default: Date.now },
    // photoUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const Guard = mongoose.model("Guard", guardSchema);
export default Guard;
