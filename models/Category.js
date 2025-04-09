import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  slug: { type: String, unique: true, sparse: true }, // sparse avoids issues with null values
  image: String,
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
