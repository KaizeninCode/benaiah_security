import Gate from "../models/Gate.js";
import Site from "../models/Site.js";

// Get all gates
export const getAllGates = async (req, res) => {
  try {
    const gates = await Gate.find().populate("site");
    
    if (gates.length === 0) {
      return res.status(200).json({ message: "No gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: gates.length, gates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get a single gate by ID
export const getGateById = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id).populate("site");
    
    if (!gate) {
      return res.status(404).json({ message: "Gate not found" });
    }
    
    return res.status(200).json(gate);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Create a new gate
export const createGate = async (req, res) => {
  try {
    const { name, site, guards, status } = req.body;
    
    const gate = new Gate({ 
      name, 
      site, 
      status: status || "inactive",
      guards: guards || [] 
    });
    
    await gate.save();
    
    // Add the gate to the site's gates array
    await Site.findByIdAndUpdate(
      site,
      { $push: { gates: gate._id } },
      { new: true }
    );

     // Populate the site before returning
    await gate.populate('site');
    
    return res.status(201).json({ 
      message: "Gate created successfully.",
      gate 
    });
  } catch (err) {
    console.error("Error creating gate:", err);
    return res.status(400).json({ message: err.message });
  }
};

// Update a gate
export const updateGate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, site, status, guards } = req.body;
    
    const oldGate = await Gate.findById(id);
    if (!oldGate) {
      return res.status(404).json({ message: "Gate not found." });
    }
    
    // If site is being changed, update both old and new sites
    if (site && site !== oldGate.site.toString()) {
      // Remove from old site
      await Site.findByIdAndUpdate(
        oldGate.site,
        { $pull: { gates: oldGate._id } }
      );
      
      // Add to new site
      await Site.findByIdAndUpdate(
        site,
        { $push: { gates: oldGate._id } }
      );
    }
    
    const updatedGate = await Gate.findByIdAndUpdate(
      id,
      { name, site, status, guards },
      { new: true }
    ).populate('site');
    
    return res.status(200).json({ 
      message: "Gate updated successfully.", 
      gate: updatedGate 
    });
    
  } catch (error) {
    console.error("Error updating gate:", error);
    return res.status(500).json({ 
      message: "Error updating gate.", 
      error: error.message 
    });
  }
};

// Delete a gate
export const deleteGate = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    
    if (!gate) {
      return res.status(404).json({ message: "Gate not found" });
    }
    
    // remove gate from site's gates array
    await Site.findByIdAndUpdate(
      gate.site,
      { $pull: { gates: gate._id } }
    );
    
    // Delete the gate
    await Gate.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: "Gate deleted" }); // Add return here
  } catch (err) {
    return res.status(500).json({ message: err.message }); // Add return here
  }
};

// get active gates
export const getActiveGates = async (req, res) => {
  try {
    const activeGates = await Gate.find({ status: "active" }).populate("site");
    
    if (activeGates.length === 0) {
      return res.status(200).json({ message: "No active gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: activeGates.length, gates: activeGates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// get inactive gates
export const getInactiveGates = async (req, res) => {
  try {
    const inactiveGates = await Gate.find({ status: "inactive" }).populate("site");
    
    if (inactiveGates.length === 0) {
      return res.status(200).json({ message: "No inactive gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: inactiveGates.length, gates: inactiveGates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};