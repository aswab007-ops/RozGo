const Earning = require('../models/Earning');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const createEarning = async (req, res) => {
  try {
    const { amount, source, description, date } = req.body;
    if (!amount || !source || !date)
      return res.status(400).json({ message: 'Amount, source and date are required' });

    let imageUrl = null, imagePublicId = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const earning = await Earning.create({
      userId: req.user._id, amount, source, description, date, imageUrl, imagePublicId
    });

    res.status(201).json({ message: 'Earning added successfully', earning });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getMyEarnings = async (req, res) => {
  try {
    const earnings = await Earning.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ earnings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEarning = async (req, res) => {
  try {
    const earning = await Earning.findOne({ _id: req.params.id, userId: req.user._id });
    if (!earning) return res.status(404).json({ message: 'Earning not found' });
    if (earning.status === 'approved')
      return res.status(400).json({ message: 'Cannot delete an approved entry' });

    if (earning.imagePublicId) await deleteFromCloudinary(earning.imagePublicId);
    await earning.deleteOne();
    res.json({ message: 'Earning deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const earnings = await Earning.find({ userId: req.user._id });
    const approved = earnings.filter(e => e.status === 'approved');
    const pending = earnings.filter(e => e.status === 'pending');
    const rejected = earnings.filter(e => e.status === 'rejected');

    const totalEarnings = approved.reduce((s, e) => s + e.amount, 0);

    const now = new Date();
    const monthlyEarnings = approved
      .filter(e => new Date(e.date).getMonth() === now.getMonth() && new Date(e.date).getFullYear() === now.getFullYear())
      .reduce((s, e) => s + e.amount, 0);

    // Monthly breakdown for chart (last 6 months)
    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const total = approved
        .filter(e => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((s, e) => s + e.amount, 0);
      monthlyBreakdown.push({ label, total });
    }

    res.json({
      totalEarnings,
      monthlyEarnings,
      totalEntries: earnings.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
      monthlyBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEarning, getMyEarnings, deleteEarning, getStats };
