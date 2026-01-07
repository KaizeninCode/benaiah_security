import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  gates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gate" }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  guards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guard" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Site = mongoose.model("Site", siteSchema);
export default Site;
