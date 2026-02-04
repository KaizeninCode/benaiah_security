import Gate from "../models/Gate.js";
import Site from "../models/Site.js";

// Helper function to clean up site guards
const cleanupSiteGuards = async (siteId) => {
  try {
    // Get all gates for this site
    const gates = await Gate.find({ site: siteId });
    
    // Collect all unique guard IDs across all gates
    const allGuardIds = new Set();
    gates.forEach(gate => {
      if (gate.guards && Array.isArray(gate.guards)) {
        gate.guards.forEach(guardId => {
          allGuardIds.add(guardId.toString());
        });
      }
    });
    
    // Update the site with only the guards that are actually assigned
    await Site.findByIdAndUpdate(
      siteId,
      { guards: Array.from(allGuardIds) },
      { new: true }
    );
    
    console.log(`✅ Cleaned up guards for site ${siteId}: ${allGuardIds.size} guards`);
  } catch (error) {
    console.error("❌ Error cleaning up site guards:", error);
  }
};

// Get all gates
export const getAllGates = async (req, res) => {
  try {
    const gates = await Gate.find()
      .populate("site", "name location status")
      .populate("guards", "name email phone role status");
    
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
    const gate = await Gate.findById(req.params.id)
      .populate("site", "name location status")
      .populate("guards", "name email phone role status");
    
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
    
    console.log("Creating gate with:", { name, site, guards, status });
    
    const gate = new Gate({ 
      name, 
      site, 
      status: status || "inactive",
      guards: guards || [] 
    });
    
    await gate.save();
    console.log("Gate saved:", gate._id);
    
    // Update the site
    const updateData = { 
      $push: { gates: gate._id }
    };
    
    // Add guards if any were provided
    if (guards && guards.length > 0) {
      updateData.$addToSet = { guards: { $each: guards } };
    }
    
    await Site.findByIdAndUpdate(site, updateData, { new: true });
    console.log("Site updated with gate and guards");

    // Populate both site AND guards before returning
    await gate.populate("site", "name location status");
    await gate.populate("guards", "name email phone role status");
    
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
    
    console.log("Updating gate:", { id, name, site, status, guards });
    
    const oldGate = await Gate.findById(id);
    if (!oldGate) {
      return res.status(404).json({ message: "Gate not found." });
    }
    
    // If site is being changed, update both old and new sites
    if (site && site !== oldGate.site.toString()) {
      console.log("Site changed, updating both sites");
      
      // Remove from old site
      await Site.findByIdAndUpdate(
        oldGate.site,
        { $pull: { gates: oldGate._id } }
      );
      
      // Clean up old site's guards
      await cleanupSiteGuards(oldGate.site);
      
      // Add to new site
      const updateData = { $push: { gates: oldGate._id } };
      if (guards && guards.length > 0) {
        updateData.$addToSet = { guards: { $each: guards } };
      }
      await Site.findByIdAndUpdate(site, updateData);
    } else if (guards) {
      // Same site, just update guards if changed
      console.log("Updating guards for same site");
      
      // Add new guards to site (if any)
      if (guards.length > 0) {
        await Site.findByIdAndUpdate(
          site || oldGate.site,
          { $addToSet: { guards: { $each: guards } } }
        );
      }
      
      // Clean up site guards to remove any that are no longer assigned
      await cleanupSiteGuards(site || oldGate.site);
    }
    
    const updatedGate = await Gate.findByIdAndUpdate(
      id,
      { name, site, status, guards },
      { new: true }
    )
      .populate("site", "name location status")
      .populate("guards", "name email phone role status");
    
    console.log("Gate updated successfully");
    
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
    
    console.log("Deleting gate:", gate._id);
    
    // Remove gate from site's gates array
    await Site.findByIdAndUpdate(
      gate.site,
      { $pull: { gates: gate._id } }
    );
    
    // Clean up site's guards after removing the gate
    await cleanupSiteGuards(gate.site);
    
    // Delete the gate
    await Gate.findByIdAndDelete(req.params.id);
    
    console.log("Gate deleted successfully");
    
    return res.status(200).json({ message: "Gate deleted" });
  } catch (err) {
    console.error("Error deleting gate:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get active gates
export const getActiveGates = async (req, res) => {
  try {
    const activeGates = await Gate.find({ status: "active" })
      .populate("site", "name location status")
      .populate("guards", "name email phone role status");
    
    if (activeGates.length === 0) {
      return res.status(200).json({ message: "No active gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: activeGates.length, gates: activeGates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get inactive gates
export const getInactiveGates = async (req, res) => {
  try {
    const inactiveGates = await Gate.find({ status: "inactive" })
      .populate("site", "name location status")
      .populate("guards", "name email phone role status");
    
    if (inactiveGates.length === 0) {
      return res.status(200).json({ message: "No inactive gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: inactiveGates.length, gates: inactiveGates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};