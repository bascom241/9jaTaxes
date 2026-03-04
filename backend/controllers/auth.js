import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../mails/sendMail.js";
import { generateToken } from "../utils/genrateToken.js";
import Article from "../models/articleSchema.js"
import ArticleCategory from "../models/articleCategorySchema.js"


export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const hashedToken = await bcrypt.hash(verificationToken, 6);
    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,
      verificationToken: hashedToken,
      verificationTokenExpiresDate: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    console.log(user);

    try {
      await sendEmail(email, verificationToken, name);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err });
    }

    res.status(201).json({ success: true, message: "user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "email or Password is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id, user.role);
    const loggedInUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
    return res.status(200).json({
      success: true,
      data: loggedInUser,
      message: "Login successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Id is required" });
    }

    const user = await User.findById(id).select("-password");
    res
      .status(200)
      .json({ success: true, user, message: "User data fetched " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = "createdAt", 
      order = "desc", 
      search,
      role,
      subscription 
    } = req.query;

    // Convert pagination params to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (subscription) {
      if (subscription === 'free') {
        query.isSubscribed = false;
      } else {
        query.isSubscribed = true;
        query.subscriptionPlan = subscription;
      }
    }

    // Determine sort order
    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    // Execute queries
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalUsers: total,
      data: users,
    });

  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch users" 
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, subscriptionPlan, isSubscribed } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role, subscriptionPlan, isSubscribed },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subscriptionPlan, isSubscribed, subscriptionExpiresAt } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { subscriptionPlan, isSubscribed, subscriptionExpiresAt },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        freeMessagesUsed: 0,
        lastResetDate: new Date()
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


