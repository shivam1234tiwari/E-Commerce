const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user & Send OTP
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists && userExists.isVerified) {
    return res.status(400).json({ message: 'User already exists and is verified' });
  }

  // Generate 6-Digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

  let user = userExists;
  if (user) {
    user.name = name;
    user.password = password;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
      isVerified: false,
    });
  }

  // Send Email with OTP
  try {
    await sendEmail({
      email: user.email,
      subject: 'SHOPPULSE - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Welcome to SHOPPULSE, ${user.name}!</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete signup.',
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP email. Please check email configuration.' });
  }
};

// @desc    Verify OTP & Activate User
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified. Please complete OTP verification.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Google OAuth Login / Auto-Register
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: Date.now() + Math.random().toString(), // Random dummy password for OAuth
        avatar: picture,
        isVerified: true,
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: 'Google Authentication Failed', error: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
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
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  googleLogin,
  getUserProfile,
};