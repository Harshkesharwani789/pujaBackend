import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  price: Number,
  stock: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  images: [String], // ✅ Ensure this matches the controller logic
});
const Product = mongoose.model("Product", productSchema);
export default Product;
