const express = require('express');
const router = express.Router();
const { createEarning, getMyEarnings, deleteEarning, getStats } = require('../controllers/earningsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getMyEarnings);
router.post('/', upload.single('proof'), createEarning);
router.delete('/:id', deleteEarning);

module.exports = router;
