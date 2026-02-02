import mongoose from "mongoose";

const gateSchema = new mongoose.Schema({
    name: {type: String, required: true},
    status: {type: String, enum: ["active", "inactive"], default: "inactive"},
    site: {type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true},
    guards: [{type: mongoose.Schema.Types.ObjectId, ref: "Guard"}],
}, {
    timestamps: true,
});

const Gate = mongoose.model("Gate", gateSchema);
export default Gate;