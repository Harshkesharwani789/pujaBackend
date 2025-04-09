import Banner from "../models/Banner.js";

// Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ priority: -1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active banners
export const getActiveBanners = async (req, res) => {
  try {
    const currentDate = new Date();

    const banners = await Banner.find({
      isActive: true,
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: currentDate } },
      ],
      startDate: { $lte: currentDate },
    }).sort({ priority: -1, createdAt: -1 });

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get banner by ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new banner
export const createBanner = async (req, res) => {
  try {
    const { title, description, link, position, startDate, endDate, priority } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const image = `/uploads/${req.file.filename}`;

    const banner = await Banner.create({
      title,
      description,
      image,
      link,
      position,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      priority: priority || 0,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a banner
export const updateBanner = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      position,
      startDate,
      endDate,
      priority,
      isActive,
    } = req.body;
    const bannerId = req.params.id;

    const banner = await Banner.findById(bannerId);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Update fields
    if (title !== undefined) banner.title = title;
    if (description !== undefined) banner.description = description;
    if (link !== undefined) banner.link = link;
    if (position !== undefined) banner.position = position;
    if (startDate !== undefined) banner.startDate = startDate;
    if (endDate !== undefined) banner.endDate = endDate;
    if (priority !== undefined) banner.priority = priority;
    if (isActive !== undefined) banner.isActive = isActive;

    if (req.file) {
      banner.image = `/uploads/${req.file.filename}`;
    }

    const updatedBanner = await banner.save();

    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.deleteOne();

    res.json({ message: "Banner removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
