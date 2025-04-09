import Product from "../models/Product.js";

// Add Product
import mongoose from "mongoose";
import slugify from "slugify";

// Add Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;

    // Step 1: Create base slug
    let baseSlug = slugify(name, { lower: true });
    let slug = baseSlug;

    // Step 2: Check if slug exists, and add -1, -2, etc. if needed
    let count = 1;
    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = new Product({
      name,
      slug,
      price,
      stock,
      category,
      images: req.files ? req.files.map((file) => file.filename) : [],
    });

    await product.save();
    res.status(201).json(product);
    console.log("Received product:", req.body);
    console.log("Received files:", req.files);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || "Failed to create product" });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.filename);
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
