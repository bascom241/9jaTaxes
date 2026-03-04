import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  gatewayReference: String, // Paystack's reference
  plan: {
    type: String,
    enum: ["monthly", "annual"],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: "NGN"
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "abandoned"],
    default: "pending"
  },
  gateway: {
    type: String,
    default: "paystack"
  },
  userEmail: String,
  authorizationUrl: String,
  failureReason: String,
  metadata: {
    ip: String,
    userAgent: String,
    timestamp: Date
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30 // Auto-delete after 30 days for cleanup
  }
}, { timestamps: true });

// Index for faster queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ createdAt: 1 });
paymentSchema.index({ "metadata.ip": 1 });

export default mongoose.model("Payment", paymentSchema);