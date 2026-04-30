const express = require('express');
const router = express.Router();
const { getAllEarnings, reviewEarning, getAdminStats } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

router.use(protect, requireAdmin);
router.get('/stats', getAdminStats);
router.get('/earnings', getAllEarnings);
router.patch('/earnings/:id', reviewEarning);

module.exports = router;
