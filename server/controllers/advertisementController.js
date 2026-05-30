const Advertisement = require('../models/Advertisement');

// @desc    Get all active advertisements
// @route   GET /api/advertisements
exports.getAdvertisements = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const ads = await Advertisement.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create advertisement
// @route   POST /api/advertisements
exports.createAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.create(req.body);
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update advertisement
// @route   PUT /api/advertisements/:id
exports.updateAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ message: 'Advertisement not found' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete advertisement
// @route   DELETE /api/advertisements/:id
exports.deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Advertisement not found' });
    res.json({ message: 'Advertisement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
