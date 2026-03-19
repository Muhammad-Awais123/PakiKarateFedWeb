import Registration from "../models/Registration.js";

export const adminListRegistrations = async (req, res) => {
  const regs = await Registration.find({})
    .populate({
      path: "eventId",
      populate: { path: "categoryId", select: "name slug" },
    })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: regs });
};

export const adminUpdateRegistrationStatus = async (req, res) => {
  const { status } = req.body || {};
  if (!["approved", "rejected", "submitted"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const updated = await Registration.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: "Registration not found" });
  res.json({ success: true, data: updated });
};

