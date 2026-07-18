const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail, hasSmtpConfig, hasPartialSmtpConfig, assertSmtpConfig } = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const generateVerificationToken = (email) => jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

const verificationEmailHtml = (verifyUrl) => `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
    <h1>Verify your RozGo email</h1>
    <p>Please click the link below to verify your account. This link is valid for 15 minutes.</p>
    <p><a href="${verifyUrl}" clicktracking="off">${verifyUrl}</a></p>
  </div>
`;

const sendVerificationEmail = async (user) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${user.verificationToken}`;
  return sendEmail({
    to: user.email,
    subject: 'RozGo - Verify your email',
    html: verificationEmailHtml(verifyUrl),
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide all required fields' });

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists with this email' });

    if (hasPartialSmtpConfig()) assertSmtpConfig();

    const requiresEmailVerification = hasSmtpConfig();
    const verificationToken = requiresEmailVerification ? generateVerificationToken(email) : undefined;

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: 'worker',
      isVerified: !requiresEmailVerification,
      verificationToken
    });

    if (!requiresEmailVerification) {
      return res.status(201).json({
        message: 'Registration successful! You can now log in.',
        requiresEmailVerification: false,
      });
    }

    try {
      await sendVerificationEmail(user);

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account before logging in.',
        requiresEmailVerification: true,
      });
    } catch (err) {
      console.error('SMTP Error details:', err);
      await User.deleteOne({ _id: user._id });
      res.status(502).json({ message: 'Could not send verification email. Please try again later.' });
    }

  } catch (error) {
    if (error.code === 'SMTP_CONFIG_INCOMPLETE') {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    if (!hasSmtpConfig()) {
      return res.status(400).json({ message: 'Email verification is not enabled.' });
    }

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide email' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ message: 'If the account exists, a verification email has been sent.' });
    if (user.isVerified) return res.status(200).json({ message: 'Email is already verified. You can log in.' });

    user.verificationToken = generateVerificationToken(user.email);
    await user.save();
    await sendVerificationEmail(user);

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json({ message: error.message || 'Failed to resend verification email' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    let decoded;
    try {
      // Decode and verify the token using EXACT SAME secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Find the user with this email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // If they are already verified, handle gracefully (solves React strict mode double-fire)
    if (user.isVerified) {
      return res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    }

    // Ensure the token matches perfectly
    if (user.verificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token or token mismatch' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins must use the dedicated admin login portal' });
    }

    if (user.isVerified !== true) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin account' });
    }

    res.json({
      message: 'Admin login successful',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};

module.exports = { register, resendVerificationEmail, verifyEmail, login, adminLogin, getMe };
