import EventCategory from "../models/EventCategory.js";
import { slugify } from "../utils/slugify.js";

export const listCategories = async (req, res) => {
  const categories = await EventCategory.find({}).sort({ name: 1 });
  res.json({ success: true, data: categories });
};

export const createCategory = async (req, res) => {
  const { name, slug, description } = req.body || {};
  if (!name || String(name).trim() === "") {
    return res.status(400).json({ message: "Category name is required" });
  }
  const finalSlug = slugify(slug || name);
  const created = await EventCategory.create({
    name: String(name).trim(),
    slug: finalSlug,
    description: description || "",
  });
  res.status(201).json({ success: true, data: created });
};

export const updateCategory = async (req, res) => {
  const { name, slug, description } = req.body || {};
  const updates = {};
  if (name != null) updates.name = String(name).trim();
  if (slug != null || name != null) updates.slug = slugify(slug || name);
  if (description != null) updates.description = description;

  const updated = await EventCategory.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ message: "Category not found" });
  res.json({ success: true, data: updated });
};

export const deleteCategory = async (req, res) => {
  const deleted = await EventCategory.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Category not found" });
  res.json({ success: true, message: "Category deleted" });
};

