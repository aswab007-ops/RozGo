const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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

    // Generate JWT verification token (15 mins) using EXACT SAME secret
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: 'worker',
      isVerified: false,
      verificationToken
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    const message = `
      <h1>Verify your email</h1>
      <p>Please click the link below to verify your account (valid for 15 minutes):</p>
      <a href="${verifyUrl}" clicktracking="off">${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'GigTracker - Verify Your Email',
        html: message,
      });

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account before logging in.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error sending verification email' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
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
      return res.status(200).json({ message: 'Email is already verified. You can log in.' });
    }

    // Ensure the token matches perfectly
    if (user.verificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token or token mismatch' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
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

module.exports = { register, verifyEmail, login, adminLogin, getMe };
