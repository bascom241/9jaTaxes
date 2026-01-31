import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../mails/sendMail.js";
import { generateToken } from "../utils/genrateToken.js";
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

    console.log(user)

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
      token
    };
    return res
      .status(200)
      .json({ success: true, data:loggedInUser, message: "Login successfully" });
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
