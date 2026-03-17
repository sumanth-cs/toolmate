import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
  generateVerificationToken,
  sendVerificationEmail,
} from "../utils/emailService.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mock login fallback for demo
    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      if (email === "demo@toolmate.ai" && password === "demo123") {
        return res.json({
          _id: "mock_id_123",
          name: "Demo User",
          email: "demo@toolmate.ai",
          isEmailVerified: true,
          token: generateToken("mock_id_123"),
        });
      }
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (
        !user.isEmailVerified &&
        process.env.MONGODB_URI !== "YOUR_MONGO_DB_URL"
      ) {
        res.status(401);
        throw new Error(
          "Please verify your email address to login. Check your inbox.",
        );
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(401).json({ message: error.message || "Error occurred" });
  }
};

// @desc    Register a new user (sends verification email)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Mock DB for demo
    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      return res.status(201).json({
        _id: "mock_new_id",
        name,
        email,
        isEmailVerified: false,
        verificationSent: true,
        token: generateToken("mock_new_id"),
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    if (user) {
      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: false,
        verificationSent: true,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message || "Error occurred" });
  }
};

// @desc    Verify email with token
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Mock mode
    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      return res.json({
        message: "Email verified successfully",
        verified: true,
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully", verified: true });
  } catch (error) {
    res.status(500).json({ message: error.message || "Verification failed" });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = async (req, res) => {
  try {
    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      return res.json({ message: "Verification email sent", sent: true });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const token = generateVerificationToken();
    user.emailVerificationToken = token;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, token);
    res.json({ message: "Verification email sent", sent: true });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send email" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      return res.json({
        _id: "mock_id_123",
        name: "Demo User",
        email: "demo@toolmate.ai",
        isEmailVerified: true,
      });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message || "Error occurred" });
  }
};

// @desc    Update user profile (name)
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      return res.json({
        _id: "mock_id_123",
        name: req.body.name || "Demo User",
        email: "demo@toolmate.ai",
        isEmailVerified: true,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Update failed" });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      process.env.MONGODB_URI === "YOUR_MONGO_DB_URL" ||
      !process.env.MONGODB_URI
    ) {
      return res.json({ message: "Password updated successfully" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "Password change failed" });
  }
};
