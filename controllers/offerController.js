import Offer from "../models/Offer.js";

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new offer
export const createOffer = async (req, res) => {
  const offer = new Offer(req.body);
  try {
    const newOffer = await offer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing offer
export const updateOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedOffer)
      return res.status(404).json({ message: "Offer not found" });
    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (!deletedOffer)
      return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
