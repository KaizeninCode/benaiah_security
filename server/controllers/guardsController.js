import Guard from "../models/Guard.js";
import Gate from "../models/Gate.js";
import Visitor from "../models/Visitor.js";
import Site from "../models/Site.js";
import GuardAssignment from "../models/GuardAssignment.js";

// 1. Create a new guard
export const createGuard = async (req, res) => {
  const { name, idNumber, phoneNumber, email } = req.body;
  if (!name || !idNumber || !phoneNumber || !email)
    return res.status(400).json({
      message: "Name, ID number, phone number, and email are required.",
    });
  try {
    const newGuard = new Guard({ name, idNumber, phoneNumber, email });
    await newGuard.save();
    res
      .status(201)
      .json({ message: "Guard created successfully.", guard: newGuard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating guard." });
  }
};

// 2. Get all guards
export const getAllGuards = async (req, res) => {
  try {
    const guards = await Guard.find();
    res.status(200).json({ total: guards.length, guards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving guards." });
  }
};

// 3. Get one guard
export const getOneGuard = async (req, res) => {
  const { id } = req.params;
  try {
    const guard = await Guard.findById(id).exec();
    if (!guard) return res.status(404).json({ message: "Guard not found." });
    res.status(200).json({ guard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving guard." });
  }
};

// 4. Update guard
export const updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const oldGuard = await Guard.findById(id).exec();
    if (!oldGuard) return res.status(404).json({ message: "Guard not found." });

    // if site is being updated/changed, handle assignment logic
    if (
      req.body.assignedSite &&
      req.body.assignedSite !== oldGuard.assignedSite.toString()
    ) {
      // remove from old site
      await Site.findByIdAndUpdate(oldGuard.assignedSite, {
        $pull: { guards: oldGuard._id },
      });
      // add to new site
      await Site.findByIdAndUpdate(req.bodyassignedSite, {
        $push: { guards: oldGuard._id },
      });
    }

    const updatedGuard = await Guard.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("site");

    res
      .status(200)
      .json({ message: "Guard updated successfully.", guard: updatedGuard });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating guard.", error: error.message });
  }
};

// 5. Delete guard
export const deleteGuard = async (req, res) => {
  const { id } = req.params;
  try {
    const guard = await Guard.findById(id).exec();
    if (!guard) return res.status(404).json({ message: "Guard not found." });
    // remove guard from assigned site's guards array
    await Site.findByIdAndUpdate(guard.assignedSite, {$pull: {guards: guard._id}})
    // delete guard
    await Guard.findByIdAndDelete(id);
    res.status(200).json({ message: "Guard deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting guard.", error: error.message });
  }
};

// 6. List gates assigned to a guard
export const getGatesForGuard = async (req, res) => {
  const { id } = req.params;
  try {
    const gates = await Gate.find({ guards: id });
    res.status(200).json({ total: gates.length, gates });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving gates for guard." });
  }
};

// 7. Update guard status
export const updateGuardStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const guard = await Guard.findById(id).exec();
    if (!guard) return res.status(404).json({ message: "Guard not found." });
    guard.status = status;
    await guard.save();
    res.status(200).json({ message: "Guard status updated.", guard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating guard status." });
  }
};

// 8. Guard assignment/activity history
export const getGuardHistory = async (req, res) => {
  const { id } = req.params;
  try {
    // Example: find all gates and visitor logs for this guard
    const gates = await Gate.find({ guards: id });
    const visitorLogs = await Visitor.find({ guard: id });
    res.status(200).json({ gates, visitorLogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving guard history." });
  }
};

// 9. Guard analytics (e.g., visitors processed)
export const getGuardAnalytics = async (req, res) => {
  const { id } = req.params;
  try {
    const visitorCount = await Visitor.countDocuments({ guard: id });
    res.status(200).json({ guardId: id, visitorCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving guard analytics." });
  }
};

// 10. Export guard logs (CSV/PDF)
export const exportGuardLogs = async (req, res) => {
  const { id } = req.params;
  const { format } = req.query;
  try {
    const logs = await Visitor.find({ guard: id }).lean();
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found for this guard." });
    }
    if (format === "csv") {
      const { Parser } = await import("json2csv");
      const fields = [
        "_id",
        "name",
        "status",
        "createdAt",
        "updatedAt",
        "gate",
        "site",
        "guard",
      ];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(logs);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="guard_${id}_logs.csv"`,
      );
      return res.status(200).send(csv);
    } else if (format === "pdf") {
      const PDFDocument = (await import("pdfkit")).default;
      const doc = new PDFDocument();
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="guard_${id}_logs.pdf"`,
        );
        res.status(200).send(pdfData);
      });
      doc.fontSize(18).text(`Logs for Guard: ${id}`, { align: "center" });
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
    res.status(500).json({ message: "Error exporting guard logs." });
  }
};

// 11. Terminate guard assignment to a site
export const terminateGuardAssignment = async (req, res) => {
  const { id, assignmentId } = req.params;
  try {
    const assignment = await GuardAssignment.findById(assignmentId).exec();
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found." });
    if (assignment.guard.toString() !== id)
      return res
        .status(400)
        .json({ message: "Assignment does not belong to this guard." });

    assignment.status = "inactive";
    await assignment.save();

    res
      .status(200)
      .json({ message: "Guard assignment terminated.", assignment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error terminating guard assignment." });
  }
};
