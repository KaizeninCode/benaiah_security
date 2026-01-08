import Gate from "../models/Gate.js";

// Get all gates
export const getAllGates = async (req, res) => {
  try {
    const gates = await Gate.find().populate("site");
    res.status(200).json(gates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single gate by ID
export const getGateById = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id).populate("site");
    if (!gate) return res.status(404).json({ message: "Gate not found" });
    res.status(200).json(gate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new gate
export const createGate = async (req, res) => {
  try {
    const { name, site, status } = req.body;
    const gate = new Gate({ name, site, status });
    await gate.save();
    res.status(201).json(gate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a gate
export const updateGate = async (req, res) => {
  try {
    const gate = await Gate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gate) return res.status(404).json({ message: "Gate not found" });
    res.status(200).json(gate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a gate
export const deleteGate = async (req, res) => {
  try {
    const gate = await Gate.findByIdAndDelete(req.params.id);
    if (!gate) return res.status(404).json({ message: "Gate not found" });
    res.status(200).json({ message: "Gate deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get active gates
export const getActiveGates = async (req, res) => {
  try {
    const activeGates = await Gate.find({ status: "active" }).populate("site");
    res.status(200).json(activeGates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};