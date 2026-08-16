// server/controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey123', {
    expiresIn: '30d',
  });
};

// @desc    Register user & Save OTP to MongoDB
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: 'An account with this email already exists and is verified' });
    }

    // Generate 6-Digit OTP & 15 minutes validity
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Direct update/upsert to guarantee OTP is saved in database
    await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name,
        email: cleanEmail,
        password: hashedPassword,
        otp: otp,
        otpExpires: otpExpires,
        isVerified: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Stored OTP in DB for ${cleanEmail}: ${otp}`);

    // Try sending email (if SMTP fails, it won't crash)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail({
          email: cleanEmail,
          subject: 'SHOPPULSE - Email Verification OTP',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Welcome to SHOPPULSE, ${name}!</h2>
              <p>Your verification OTP is:</p>
              <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
              <p>Valid for 15 minutes.</p>
            </div>
          `,
        });
      }
    } catch (e) {
      console.warn('SMTP delivery warning:', e.message);
    }

    return res.status(200).json({
      message: 'Verification OTP has been sent to your email!',
      email: cleanEmail,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanOtp = otp ? String(otp).trim() : '';

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    console.log(`🔍 Verifying for ${cleanEmail} -> DB OTP: [${user.otp}], Entered OTP: [${cleanOtp}]`);

    // Check if OTP matches
    if (!user.otp || String(user.otp).trim() !== cleanOtp) {
      return res.status(400).json({ message: 'Invalid OTP code. Please enter the correct code.' });
    }

    // Check if Expired
    if (user.otpExpires && new Date(user.otpExpires).getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please sign up again to get a new code.' });
    }

    // Mark as Verified & Clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    console.log(`🎉 User ${cleanEmail} verified successfully!`);

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

// @desc    Login
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
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
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

// @desc    Google OAuth
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
    res.status(400).json({ message: 'Google Auth Error: ' + error.message });
  }
};

// @desc    Get Profile
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