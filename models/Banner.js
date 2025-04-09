import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      enum: ["home", "category", "product"],
      default: "home",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
