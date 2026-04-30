const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, adminLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
