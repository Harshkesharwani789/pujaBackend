import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["discount", "bogo", "bundle"],
    },
    discount: {
      type: Number,
      required: function () {
        return this.type === "discount";
      },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    products: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["active", "expired", "scheduled"],
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
