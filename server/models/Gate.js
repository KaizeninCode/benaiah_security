import mongoose from "mongoose";

const gateSchema = new mongoose.Schema({
    name: {type: String, required: true},
    location: {type: String},
    site: {type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true},
    guards: [{type: mongoose.Schema.Types.ObjectId, ref: "Guard", required: true}],
}, {
    timestamps: true,
});

const Gate = mongoose.model("Gate", gateSchema);
export default Gate;