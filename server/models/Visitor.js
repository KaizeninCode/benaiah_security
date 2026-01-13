import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idNumber: { type: String, required: true }, // National ID or similar
    purpose: { type: String, required: true },
    vehicleReg: { type: String },
    expectedTime: { type: Date },
    arrivalTime: { type: Date },
    departureTime: { type: Date },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
    status: {
      type: String,
      enum: ["pre-registered", "arrived", "departed"],
      default: "pre-registered",
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
