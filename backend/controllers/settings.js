// controllers/settings.js
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "notificationSettings theme"
    );
    
    // Default settings if not set
    const settings = {
      notificationSettings: user?.notificationSettings || {
        emailNotifications: true,
        pushNotifications: false,
        articleUpdates: true,
        marketingEmails: false,
      },
      theme: user?.theme || "light",
    };

    res.json({
      success: true,
      ...settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, articleUpdates, marketingEmails } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        notificationSettings: {
          emailNotifications,
          pushNotifications,
          articleUpdates,
          marketingEmails,
        },
      },
      { new: true }
    ).select("notificationSettings");

    res.json({
      success: true,
      notificationSettings: user.notificationSettings,
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({ success: false, message: "Invalid theme" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme },
      { new: true }
    ).select("theme");

    res.json({
      success: true,
      theme: user.theme,
    });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters" 
      });
    }

    const user = await User.findById(req.user.id);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      success: true, 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};