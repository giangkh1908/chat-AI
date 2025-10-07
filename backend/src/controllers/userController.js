import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

// register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 3600000, // 1 hour
    });
    // sent verify email
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    //  create token and send response
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// login with Facebook
export const loginWithFacebook = async (req, res) => {
  try {
    const { facebookId, name, email } = req.body;
    if (!facebookId)
      return res.status(400).json({ message: "Thiếu facebookId." });

    let user = await userModel.findOne({ facebookId });
    if (!user) {
      user = await userModel.create({
        name,
        email,
        facebookId,
        isVerified: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập Facebook thành công!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Facebook login error:", err);
    res.status(500).json({ message: "Lỗi server khi login Facebook." });
  }
};

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin user." });
  }
};
