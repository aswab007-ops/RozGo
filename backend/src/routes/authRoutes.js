const express = require('express');
const router = express.Router();
const { register, resendVerificationEmail, verifyEmail, login, adminLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/resend-verification', resendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
