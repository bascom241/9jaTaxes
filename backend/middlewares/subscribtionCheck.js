// middleware/subscriptionCheck.js
import User from "../models/userSchema.js";

export const checkSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return next();
        }
        
        const user = await User.findById(userId);
        if (user) {
            // Attach subscription info to request
            req.user.subscription = {
                isSubscribed: user.isSubscribed,
                plan: user.subscriptionPlan,
                expiresAt: user.subscriptionExpiresAt,
                hasActiveSubscription: user.hasActiveSubscription
            };
        }
        
        next();
    } catch (error) {
        console.error("Subscription check error:", error);
        next();
    }
};

// Middleware to protect premium routes
export const requireSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || !user.hasActiveSubscription) {
            return res.status(402).json({
                success: false,
                message: "Subscription required",
                requiresPayment: true
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error checking subscription"
        });
    }
};