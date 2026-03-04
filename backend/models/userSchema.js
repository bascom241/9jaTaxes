import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        enum: ["free", "monthly", "annual"],
        default: "free"
    },
    subscriptionExpiresAt: Date,
    freeMessagesUsed: {
        type: Number,
        default: 0
    },
    totalMessagesUsed: {
        type: Number,
        default: 0
    },
    payStackCustomerCode: String,
    verificationToken: String,
    verificationTokenExpiresDate: Date,
    lastResetDate: {
        type: Date,
        default: Date.now
    },
      notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    articleUpdates: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
}, { timestamps: true });

// Method to check if user can send message
userSchema.methods.canSendMessage = function() {
    const now = new Date();
    
    // Reset free messages daily
    const lastReset = new Date(this.lastResetDate);
    if (now.toDateString() !== lastReset.toDateString()) {
        this.freeMessagesUsed = 0;
        this.lastResetDate = now;
        return true;
    }
    
    // Check subscription status
    if (this.isSubscribed && this.subscriptionExpiresAt > now) {
        return true; // Unlimited messages for subscribed users
    }
    
    // Free tier limit (5 messages per day)
    return this.freeMessagesUsed < 5;
};

// Method to increment message count
userSchema.methods.recordMessage = async function() {
    this.freeMessagesUsed += 1;
    this.totalMessagesUsed += 1;
    await this.save();
    return this.freeMessagesUsed;
};

// Virtual for checking subscription validity
userSchema.virtual('hasActiveSubscription').get(function() {
    const now = new Date();
    return this.isSubscribed && 
           this.subscriptionExpiresAt && 
           this.subscriptionExpiresAt > now;
});

export default mongoose.model("User", userSchema);