/*
===== ENDPOINTS =====
1. Site Setup & Management
- POST / (create site with locations, gates, users) [DONE]
- PATCH /:id/details (update site details) [DONE]
- DELETE /:id (delete site) [DONE]

2. Gate Management
- POST /gates (create a new gate, assign to site)
- PATCH /gates/:id (update gate details)
- DELETE /gates/:id (remove gate)
- GET /gates/:id (get gate details)
- GET /:id/gates (list gates for a site)

3. Guard Assignments to Gates
- POST /gates/:id/guards (assign guard(s) to gate)
- DELETE /gates/:id/guards/:guardId (remove guard from gate)
- GET /gates/:id/guards (list guards assigned to gate)

4. User Assignments to Sites
- POST /sites/:id/users (assign user to site)
- DELETE /sites/:id/users/:userId (remove user from site)
import Site from "../models/Site.js";
import GuardAssignment from "../models/GuardAssignment.js";
import Visitor from "../models/Visitor.js";
- GET /sites (list all sites) [DONE]
- GET /sites/:id (get site details) [DONE]

6. Analytics and Monitoring
- GET /sites/:id/visitors/live-count (monitor live visitor count per site)
- GET /sites/:id/analytics/daily-count (site-level visitor analytics)
- GET /sites/:id/analytics/peak-hours (site-level peak hours)

7. Export Logs
- GET /sites/:id/logs/export?format=csv|pdf (export logs for a site)

|| - WORKFLOW - ||
Full CRUD for site management, including setup (locations, gates, users), gate management, guard assignments to gates, analytics, live monitoring, and log export.

====================
*/

import Site from "../models/Site.js";
import GuardAssignment from "../models/GuardAssignment.js";
import Visitor from "../models/Visitor.js";

// 1. Create a new site
export const createSite = async (req, res) => {
  const { name, location, description } = req.body;
  if (!name || !location)
    return res.status(400).json({ message: "Name and location are required." });
  try {
    const newSite = new Site({ name, location, description });
    await newSite.save();
    res
      .status(201)
      .json({ message: "Site created successfully.", site: newSite });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to create site." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating site." });
  }
};

// 2. Get all sites
export const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find();
    const total = await Site.countDocuments();
    
    // Just send one response and return
    return res.status(200).json({ total, sites });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving sites." });
  }
};
// 3. Get one site
export const getOneSite = async (req, res) => {
  try {
    const { id } = req.params;
    const site = await Site.findById(id).exec();
    res.status(200).json({ total: 1, site });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving site." });
  }
};

// 4. Update site --> ID FROM PARAMS, BODY HAS FIELDS TO UPDATE
export const updateSite = async (req, res) => {
  try {
    const { id } = req.params;
    const {name, location, status, description} = req.body
    const site = await Site.findByIdAndUpdate(id, {name, location, status, description}, {new: true}).exec();
    if (!site) return res.status(400).json({ message: "Site not found." });

    res.status(200).json({ message: "Site updated successfully.", site });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving site." });
  }
};

// 5. Delete site
export const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;
    const site = await Site.findById(id).exec();
    if (!site) return res.status(400).json({ message: "Site not found." });
    await Site.deleteOne(site);

    res.status(200).json({ message: "Site deleted successfully.", site });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting site." });
  }
};

/* GATE MANAGEMENT */
// 6. Create a new gate and assign to site
export const createGate = async (req, res) => {
  const { name, location, siteId } = req.body;
  if (!name || !location || !siteId)
    return res
      .status(400)
      .json({ message: "Name, location, and site ID required." });
  try {
    const newGate = new Gate({ name, location, site: siteId });
    await newGate.save();
    res
      .status(201)
      .json({ message: "Gate created successfully.", gate: newGate });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to create gate." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating gate." });
  }
};

// 7. Get all gates for a site
export const getAllGatesForSite = async (req, res) => {
  const { id } = req.params;
  const foundSite = await Site.findById(id).populate("gates").exec();
  if (!foundSite) return res.status(400).json({ message: "Site not found." });
  res
    .status(200)
    .json({ total: foundSite.gates.length, gates: foundSite.gates || [] });
};

// 8. Get one gate for a site
export const getOneGateForSite = async (req, res) => {
  const { gateId, siteId } = req.params;
  // Find the gate and ensure it belongs to the site
  const gate = await Gate.findOne({ _id: gateId, site: siteId }).exec();
  if (!gate)
    return res.status(404).json({ message: "Gate not found for this site." });
  res.status(200).json({ gate });
};

// 9. Update gate details
export const updateGate = async (req, res) => {
  try {
    const { id } = req.body;
    const gate = await Gate.findById(id).exec();
    if (!gate) return res.status(400).json({ message: "Gate not found." });
    // update fields
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && key !== "id") {
        gate[key] = req.body[key];
      }
    }
    await gate.save();
    res.status(200).json({ message: "Gate updated successfully.", gate });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to update gate." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating gate." });
  }
};

// 10. Delete gate
export const deleteGate = async (req, res) => {
  try {
    const { id } = req.body;
    const gate = await Gate.findById(id).exec();
    if (!gate) return res.status(400).json({ message: "Gate not found." });
    await Gate.deleteOne(gate);

    res.status(200).json({ message: "Gate deleted successfully.", gate });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to delete gate." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting gate." });
  }
};

/* ASSIGN GUARDS TO GATES */
// 11. Assign guard(s) to gate
export const assignGuardsToGate = async (req, res) => {
  const { gateId } = req.body;
  const { guardIds } = req.body; // -> expects an array of guard IDs
  if (!gateId || !Array.isArray(guardIds) || guardIds.length === 0)
    return res
      .status(400)
      .json({ message: "Gate ID and array of guard IDs are required." });
  try {
    const gate = await Gate.findById(gateId).exec();
    if (!gate) return res.status(400).json({ message: "Gate not found." });

    // add guards (avoid duplicates)
    gate.guards = Array.from(new Set([...gate.guards, ...guardIds]));
    await gate.save();
    res.status(200).json({ message: "Guards assigned to gate.", gate });
    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Failed to assign guards to gate." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning guards to gate." });
  }
};

// The following code appears to be misplaced and should be moved to its own function:

// 21. Export logs for a site
export const exportSiteLogs = async (req, res) => {
  const { id } = req.params;
  const { format } = req.query;
  const foundSite = await Site.findById(id).exec();
  if (!foundSite) return res.status(404).json({ message: "Site not found." });
  try {
    // Query all visitor logs for this site
    const logs = await Visitor.find({ site: id }).lean();
    const total = await Visitor.countDocuments({ site: id });
    if (!logs || logs.length === 0) {
      return res
        .status(404)
        .json({
          message: `No logs found for site ${foundSite.name}.`,
          total: 0,
        });
    }

    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Failed to retrieve current visitor count." });
    // Add logic for exporting logs in the requested format (csv/pdf) here
    res
      .status(200)
      .json({ message: "Logs exported successfully.", total, logs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving site." });
  }
};

// 22. Get all gates
export const getAllGates = async (req, res) => {
  try {
    const gates = await Gate.find().exec();
    const total = await Gate.countDocuments();
    res.status(200).json({ total, gates });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to retrieve gates." });
    if (!gates.length)
      return res
        .status(200)
        .json({ message: "No gates found.", total: 0, gates: [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving gates." });
  }
};
