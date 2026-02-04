import mongoose from "mongoose";

const hostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idNumber: { type: Number, required: true, unique: true }, // National ID or employee number
    phoneNumber: { type: Number, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    unit: { type: String, required: true, unique: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
      movedIn: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Host = mongoose.model("Host", hostSchema);
export default Host;
