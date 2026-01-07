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
- GET /sites/:id/users (list users assigned to site)

5. Site Retrieval and History
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
import Gate from "../models/Gate.js";
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
    res.status(200).json({ total, sites });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to retrieve sites." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving sites." });
  }
};

// 3. Get one site
export const getOneSite = async (req, res) => {
  try {
    const { id } = req.body;
    const site = await Site.findById(id).exec();
    res.status(200).json({ total: 1, site });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to retrieve site." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving site." });
  }
};

// 4. Update site
export const updateSite = async (req, res) => {
  try {
    const { id } = req.body;
    const site = await Site.findById(id).exec();
    if (!site) return res.status(400).json({ message: "Site not found." });

    // update fields
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && key !== "id") {
        site[key] = req.body[key];
      }
    }
    await site.save();
    res.status(200).json({ message: "Site updated successfully.", site });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to update site." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving site." });
  }
};

// 5. Delete site
export const deleteSite = async (req, res) => {
  try {
    const { id } = req.body;
    const site = await Site.findById(id).exec();
    if (!site) return res.status(400).json({ message: "Site not found." });
    await Site.deleteOne(site);

    res.status(200).json({ message: "Site deleted successfully.", site });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to delete site." });
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
  const { gateId } = req.body.gateId;
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
    res.status(500).json({ message: " Error assigning guards to gate." });
  }
};

// 12. Get all guards assigned to gate
export const getAllGuardsForGate = async (req, res) => {
  const { id } = req.params;
  const foundGate = await Gate.findById(id).populate("guards").exec();
  if (!foundGate) return res.status(400).json({ message: "Gate not found." });
  res
    .status(200)
    .json({ total: foundGate.guards.length, guards: foundGate.guards || [] });
  if (!res.ok)
    return res.status(400).json({ message: "Failed to retrieve guards." });
};

// 13. Remove guard from gate
export const removeGuardFromGate = async (req, res) => {
  const { gateId, guardId } = req.params;
  try {
    const gate = await Gate.findById(gateId).exec();
    if (!gate) return res.status(400).json({ message: "Gate not found." });
    gate.guards = gate.guards.filter((id) => id.toString() !== guardId);
    await gate.save();
    res.status(200).json({ message: "Guard removed from gate.", gate });
    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Failed to remove guard from gate." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing guard from gate." });
  }
};

/* SITE RETRIEVAL AND HISTORY */
// 14. Monitor live visitor count per site
export const getLiveVisitorCount = async (req, res) => {
  const { id } = req.params;
  const foundSite = await Site.findById(id).exec();
  if (!foundSite) return res.status(404).json({ message: "Site not found." });
  // count visitors with status arrived and not yet departed/left
  const liveCount = await Visitor.countDocuments({
    site: id,
    status: "arrived",
  });
  res.status(200).json({ siteId: id, liveVisitorCount: liveCount });
  if (!res.ok)
    return res
      .status(400)
      .json({ message: "Failed to retrieve live visitor count." });
};

// 15. Site-level visitor analytics - daily count
export const getSiteDailyVisitorCount = async (req, res) => {
  const { id } = req.params;
  const foundSite = await Site.findById(id).exec();
  if (!foundSite) return res.status(404).json({ message: "Site not found." });
  try {
    // Aggregate visitors for this site, group by date, count per day
    const dailyCounts = await Visitor.aggregate([
      { $match: { site: foundSite._id } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 },
      },
    ]);

    // Format result for frontend
    const formatted = dailyCounts.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(
        2,
        "0"
      )}-${String(item._id.day).padStart(2, "0")}`,
      count: item.count,
    }));
    res.status(200).json({ siteId: id, dailyVisitorCounts: formatted });
    if (!res.ok)
      return res.status(400).json({
        message: `Failed to retrieve daily visitor count for ${foundSite.name}.`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Error retrieving daily visitor count for ${foundSite.name}.`,
    });
  }
};

// 16. Site-level peak hours
export const getSitePeakHours = async (req, res) => {
  const { id } = req.params;
  const foundSite = await Site.findById(id).exec();
  if (!foundSite) return res.status(404).json({ message: "Site not found." });
  try {
    // Aggregate visitors for this site, group by hour, count per hour
    const peakHours = await Visitor.aggregate([
      { $match: { site: foundSite._id } },
      {
        $group: {
          _id: {
            hour: { $hour: "$createdAt" },
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // format results for frontend
    const formatted = peakHours.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(
        2,
        "0"
      )}-${String(item._id.day).padStart(2, "0")}`,
      hour: item._id.hour,
      count: item.count,
    }));

    res.status(200).json({
      message: "Site peak hours retrieved successfully.",
      siteId: id,
      peakHours: formatted,
    });
    if (!res.ok)
      return res.status(400).json({
        message: `Failed to retrieve peak hours for ${foundSite.name}.`,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Error retrieving peak hours for ${foundSite.name}.` });
  }
};

/* EXPORT LOGS */
// 17. Export logs for a site
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
        .json({ message: `No logs found for site ${foundSite.name}.`, total: 0 });
    }

    if (format === "csv") {
      // CSV export using json2csv
      const { Parser } = await import("json2csv");
      const fields = [
        "_id",
        "name",
        "status",
        "createdAt",
        "updatedAt",
        "gate",
        "guard",
        "site",
      ];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(logs);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${foundSite.name}_logs.csv"`
      );
      return res.status(200).send(csv);
    } else if (format === "pdf") {
      // PDF export using pdfkit
      const PDFDocument = (await import("pdfkit")).default;
      const doc = new PDFDocument();
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${foundSite.name}_logs.pdf"`
        );
        res.status(200).send(pdfData);
      });
      doc
        .fontSize(18)
        .text(`Logs for Site: ${foundSite.name}`, { align: "center" });
      doc.moveDown();
      logs.forEach((log, idx) => {
        doc.fontSize(12).text(`Visitor #${idx + 1}`);
        Object.entries(log).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`);
        });
        doc.moveDown();
      });
      doc.end();
    } else {
      return res
        .status(400)
        .json({ message: "Invalid format. Use 'csv' or 'pdf'." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Error exporting logs for site ${foundSite.name}.` });
  }
};

/* USER ASSIGNMENT TO SITES */
// 18. Assign user to site
export const assignUserToSite = async (req, res) => {
  const { siteId, userId } = req.body;
  if (!siteId || !userId)
    return res
      .status(400)
      .json({ message: "Site ID and user ID are required." });

  try {
    /*
    1. find site by siteId
    2. check if userId already in site.users
    3. if not, add userId to site.users
    4. save site and return a success response
    5. handle errors
    */
    const site = await Site.findById(siteId).exec();
    if (!site) return res.status(404).json({ message: "Site not found." });
    if (site.users.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already assigned to site." });
    }
    site.users.push(userId);
    await site.save();
    res
      .status(200)
      .json({ message: "User assigned to site successfully.", site });
    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Failed to assign user to site." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning user to site." });
  }
};

// 19. Remove user from site
export const removeUserFromSite = async (req, res) => {
  const { siteId, userId } = req.params;
  if (!siteId || !userId)
    return res
      .status(400)
      .json({ message: "Site ID and user ID are required." });
  try {
    /*
    1. find site by siteId
    2. check if userId already in site.users and remove the user
    3. save site and return a success response
    4. handle errors
    */
    const site = await Site.findById(siteId).exec();
    if (!site) return res.status(404).json({ message: "Site not found." });
    const userToFilter = site.users.find((id) => id.toString() === userId);
    if (!userToFilter)
      return res
        .status(400)
        .json({ message: "User not assigned to this site." });
    site.users = site.users.filter((id) => id.toString() !== userId);
    await site.save();
    res
      .status(200)
      .json({ message: "User removed from site successfully.", site });
    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Failed to remove user from site." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing user from site." });
  }
};

// 20. Get all users assigned to site
export const getAllUsersForSite = async (req, res) => {
  const { id } = req.params;
  const foundSite = await Site.findById(id).populate("users").exec();
  if (!foundSite) return res.status(400).json({ message: "Site not found." });
  res
    .status(200)
    .json({ total: foundSite.users.length, users: foundSite.users || [] });
  if (!res.ok)
    return res.status(400).json({ message: "Failed to retrieve users." });
};

// 21. Live number of visitors currently in site
export const getCurrentVisitorCount = async (req, res) => {
  const { id } = req.params;
  try {
    const foundSite = await Site.findById(id).exec();
    if (!foundSite) return res.status(404).json({ message: "Site not found." });
    // count visitors with status arrived and not yet departed/left
    const currentCount = await Visitor.countDocuments({
      site: id,
      status: "arrived",
    });
    res.status(200).json({ siteId: id, currentVisitorCount: currentCount });
    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Failed to retrieve current visitor count." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving site." });
  }
};


// 22. Get all gates
export const getAllGates = async(req, res) => {
  try {
    const gates = await Gate.find().exec()
    const total = await Gate.countDocuments()
    res.status(200).json({ total, gates });
    if (!res.ok)
      return res.status(400).json({ message: "Failed to retrieve gates." });
    if(!gates.length)
      return res.status(200).json({ message: "No gates found.", total: 0, gates: [] });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error retrieving gates." });
  }
}