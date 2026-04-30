const Earning = require('../models/Earning');

const getAllEarnings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const earnings = await Earning.find(filter)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ earnings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const reviewEarning = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be approved or rejected' });

    const earning = await Earning.findById(req.params.id);
    if (!earning) return res.status(404).json({ message: 'Earning not found' });

    earning.status = status;
    earning.adminComment = adminComment || '';
    earning.reviewedBy = req.user._id;
    earning.reviewedAt = new Date();
    await earning.save();

    const updated = await Earning.findById(earning._id)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name');

    res.json({ message: `Earning ${status} successfully`, earning: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const all = await Earning.find();
    const approved = all.filter(e => e.status === 'approved');
    res.json({
      total: all.length,
      pending: all.filter(e => e.status === 'pending').length,
      approved: approved.length,
      rejected: all.filter(e => e.status === 'rejected').length,
      totalAmount: approved.reduce((s, e) => s + e.amount, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllEarnings, reviewEarning, getAdminStats };
