import Category from "../models/Category.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

import slugify from "slugify";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const category = new Category({
      name,
      description,
      slug,
      image: req.file?.path || null,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("Add Category Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file ? `/uploads/categories/${req.file.filename}` : null;

    const updatedFields = { name, description };
    if (image) updatedFields.image = image;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Remove reference from products
    await Product.updateMany({ category: id }, { $unset: { category: 1 } });

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
