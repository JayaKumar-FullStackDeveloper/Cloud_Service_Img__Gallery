const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const crypto = require("crypto");
const verifyEmailTemplate = require("../emails/templates/verifyEmailTemplate");
const sendEmail = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateOTP = () => crypto.randomInt(1000, 9999).toString();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phonenumber, password } = req.body;
  const otp = generateOTP();
  const otpCreatedAt = new Date();
  
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.isVerified) {
      existingUser.otp = otp;
      existingUser.otpCreatedAt = otpCreatedAt;
      await existingUser.save();
      await sendEmail(existingUser.email, "Email verification", verifyEmailTemplate(otp, name));
      return res.json({ message: `OTP resent to email ${existingUser.email}` });
    } else {
      return res.status(400).json({ message: "Email already registered" });
    }
  }

  const user = await User.create({
    name,
    email,
    phonenumber,
    password,
    otp,
    otpCreatedAt,
  });

  if (user) {
    await sendEmail(user.email, "Email verification", verifyEmailTemplate(otp, name));
    res.json({ message: `OTP sent to email ${user.email}` });
  } else {
    res.status(400).json({ message: "User registration failed" });
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpAge = (new Date() - user.otpCreatedAt) / 3000; // Age of the OTP in seconds
    if (otpAge > 3000) { 
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    } else {
      user.otp = null;
      user.otpCreatedAt = null;
      user.isVerified = true;
      await user.save();
      res.json({ success: true, message: "OTP verified successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not registered or not verified" });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpCreatedAt = new Date();
  try {
    const user = await User.findOne({ email });
    if (user) {
        user.otp = otp;
        user.otpCreatedAt = otpCreatedAt;
        await user.save();
        await sendEmail(user.email, "Email verification", verifyEmailTemplate(otp, user.name));
        return res.json({ message: `OTP resent to email ${user.email}` });
      } else {
        return res.status(404).json({ message: 'User not found' });
        }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});


const resetpassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await User.findById(decoded.id);
    user.password = password;
    await user.save();
    res.json({ status: true, message: "Password updated" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid token" });
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpCreatedAt = new Date();
    await user.save();

    await sendEmail(user.email, "Email verification", verifyEmailTemplate(otp, user.name));
    res.json({ message: `OTP resent to email ${user.email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id; 
    const updates = req.body; 
  
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, 
    });
   
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  verifyOTP,
  registerUser,
  signin,
  forgotpassword,
  resetpassword,
  resendOTP,
  getUserDetails,
  getAllUsers,
  deleteUser,
  updateUserById
};

