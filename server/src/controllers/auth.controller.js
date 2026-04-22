
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetEmail } from "../utils/email.util.js";

// signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ msg: "User created" });
  } catch (err) {
      console.log(err); 
    res.status(500).json({ msg: "Server error" });
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
 
    const user = await User.findOne({ email });
     console.log("User found:", user); // ← add this

 
    // Always respond with success to avoid user enumeration
    if (!user) {
      return res.status(200).json({ msg: "If that email exists, a reset link has been sent." });
    }
 
    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
 
    user.resetPasswordToken   = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
 
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendResetEmail(user.email, resetURL);
 
    res.status(200).json({ msg: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong. Please try again." });
  }
};
 
// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
 
    // Hash the incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
 
    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    });
 
    if (!user) {
      return res.status(400).json({ msg: "Token is invalid or has expired." });
    }
 
    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
 
    // Clear reset fields
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
 
    res.status(200).json({ msg: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong. Please try again." });
  }
};
 