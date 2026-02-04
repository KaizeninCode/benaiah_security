import Site from "../models/Site.js";
import Gate from "../models/Gate.js";
import Visitor from "../models/Visitor.js";

// 1. Create a new site
export const createSite = async (req, res) => {
  try {
    const { name, location, description, status } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required." });
    }
    
    const newSite = new Site({ 
      name, 
      location, 
      description,
      status: status || "inactive",
      gates: [],
      guards: [],
      hosts: []
    });
    
    await newSite.save();
    
    return res.status(201).json({ 
      message: "Site created successfully.", 
      site: newSite 
    });
  } catch (error) {
    console.error("Error creating site:", error);
    return res.status(500).json({ message: "Error creating site." });
  }
};

// 2. Get all sites
export const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find()
      .populate("gates", "name status") // Only populate needed fields
      .populate("guards", "name email role status")
      .populate("hosts", "name email");
    
    const total = await Site.countDocuments();
    
    return res.status(200).json({ total, sites });
  } catch (error) {
    console.error("Error retrieving sites:", error);
    return res.status(500).json({ message: "Error retrieving sites." });
  }
};

// 3. Get one site
export const getOneSite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const site = await Site.findById(id)
      .populate("gates", "name status")
      .populate("guards", "name email role status")
      .populate("hosts", "name email");
    
    if (!site) {
      return res.status(404).json({ message: "Site not found." });
    }
    
    return res.status(200).json({ site });
  } catch (error) {
    console.error("Error retrieving site:", error);
    return res.status(500).json({ message: "Error retrieving site." });
  }
};

// 4. Update site
export const updateSite = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, status, description } = req.body;
    
    const site = await Site.findByIdAndUpdate(
      id, 
      { name, location, status, description }, 
      { new: true }
    )
      .populate("gates", "name status")
      .populate("guards", "name email role status")
      .populate("hosts", "name email");
    
    if (!site) {
      return res.status(404).json({ message: "Site not found." });
    }

    return res.status(200).json({ 
      message: "Site updated successfully.", 
      site 
    });
  } catch (error) {
    console.error("Error updating site:", error);
    return res.status(500).json({ message: "Error updating site." });
  }
};

// 5. Delete site
export const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const site = await Site.findById(id);
    
    if (!site) {
      return res.status(404).json({ message: "Site not found." });
    }
    
    // Delete all gates associated with this site
    await Gate.deleteMany({ site: id });
    
    // Delete the site
    await Site.findByIdAndDelete(id);

    return res.status(200).json({ 
      message: "Site and associated gates deleted successfully." 
    });
  } catch (error) {
    console.error("Error deleting site:", error);
    return res.status(500).json({ message: "Error deleting site." });
  }
};

// 6. Get all gates for a site
export const getAllGatesForSite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const site = await Site.findById(id).populate({
      path: "gates",
      populate: {
        path: "guards",
        select: "name email role status"
      }
    });
    
    if (!site) {
      return res.status(404).json({ message: "Site not found." });
    }
    
    return res.status(200).json({ 
      total: site.gates.length, 
      gates: site.gates || [] 
    });
  } catch (error) {
    console.error("Error retrieving gates for site:", error);
    return res.status(500).json({ message: "Error retrieving gates." });
  }
};

// 7. Export logs for a site
export const exportSiteLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    const site = await Site.findById(id);
    
    if (!site) {
      return res.status(404).json({ message: "Site not found." });
    }
    
    // Query all visitor logs for this site
    const logs = await Visitor.find({ site: id }).lean();
    const total = await Visitor.countDocuments({ site: id });
    
    if (!logs || logs.length === 0) {
      return res.status(404).json({
        message: `No logs found for site ${site.name}.`,
        total: 0,
      });
    }

    // TODO: Add logic for exporting logs in the requested format (csv/pdf)
    return res.status(200).json({ 
      message: "Logs retrieved successfully.", 
      total, 
      logs 
    });
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return res.status(500).json({ message: "Error retrieving logs." });
  }
};