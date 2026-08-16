// server/controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user & Send Real OTP via Email
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Generate 6-Digit Real OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // Valid for 15 minutes

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save/Update user with OTP in DB
    await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name,
        email: cleanEmail,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`🔑 OTP generated for ${cleanEmail}: ${otp}`);

    // Dispatch Email via Nodemailer
    try {
      await sendEmail({
        email: cleanEmail,
        subject: 'SHOPPULSE - Email Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 16px;">
            <h2 style="color: #4F46E5; margin-bottom: 8px;">Welcome to SHOPPULSE, ${name}!</h2>
            <p style="color: #666; font-size: 14px;">Your 6-digit email verification security code is:</p>
            <div style="background: #F3F4F6; padding: 15px; text-align: center; border-radius: 12px; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1E293B;">${otp}</span>
            </div>
            <p style="color: #999; font-size: 12px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      });

      return res.status(200).json({
        message: 'A 6-digit verification code has been sent to your email address.',
        email: cleanEmail,
      });
    } catch (emailError) {
      console.error('❌ Nodemailer Error:', emailError);
      return res.status(500).json({
        message: 'Could not send verification email. Please verify your Gmail App Password credentials.',
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Verify Real OTP & Activate User
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email ? String(email).toLowerCase().trim() : '';
    const cleanOtp = otp ? String(otp).trim() : '';

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({ message: 'Email and OTP are required fields' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    const dbOtp = user.otp ? String(user.otp).trim() : null;
    const isExpired = user.otpExpires ? new Date(user.otpExpires).getTime() < Date.now() : true;

    // Strict validation
    if (!dbOtp || dbOtp !== cleanOtp) {
      return res.status(400).json({ message: 'Invalid OTP code. Please enter the correct code.' });
    }

    if (isExpired) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
    }

    // Activate Account & Clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log(`✅ User verified: ${cleanEmail}`);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: true,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let isMatch = false;
    if (user.matchPassword && typeof user.matchPassword === 'function') {
      isMatch = await user.matchPassword(password);
    } else if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified && !user.isAdmin) {
      return res.status(401).json({ message: 'Email not verified. Please complete OTP verification.' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Google OAuth Login / Auto-Register
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { token, mockUser } = req.body;
    let name = mockUser?.name || 'Google User';
    let email = mockUser?.email || 'google.user@gmail.com';
    let picture = mockUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300';

    if (token && process.env.GOOGLE_CLIENT_ID) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
      picture = payload.picture;
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const randomPassword = await bcrypt.hash(Date.now() + Math.random().toString(), 10);
      user = await User.create({
        name,
        email: cleanEmail,
        password: randomPassword,
        avatar: picture,
        isVerified: true,
        isAdmin: false,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: true,
      avatar: user.avatar || picture,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: 'Google Authentication Failed: ' + error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  googleLogin,
  getUserProfile,
};