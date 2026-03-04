import User from "../models/userSchema.js";
import Payment from "../models/paymentSchema.js";
import crypto from "crypto";
import axios from "axios";

export const initializePayment = async (req, res) => {
    try {
        const { id } = req.user;
        const { plan } = req.body;
        
        // Validate input
        if (!plan || !["monthly", "annual"].includes(plan)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan. Choose 'monthly' or 'annual'"
            });
        }
        
        // Get user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Check if user already has active subscription
        if (user.hasActiveSubscription) {
            return res.status(400).json({
                success: false,
                message: "You already have an active subscription"
            });
        }
        
        // Determine amount
        const planAmounts = {
            monthly: 3000,
            annual: 30000
        };
        const amount = planAmounts[plan];
        
        // Generate unique reference
        const reference = `TAXAPP_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
        
        // Create payment record
        const paymentRecord = await Payment.create({
            userId: id,
            reference,
            plan,
            amount,
            currency: "NGN",
            status: "pending",
            userEmail: user.email,
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                timestamp: new Date()
            }
        });
        
        // Initialize Paystack payment
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: user.email,
                amount: amount * 100, // Convert to kobo
                reference,
                callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
                metadata: {
                    userId: id,
                    plan: plan,
                    paymentId: paymentRecord._id.toString()
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );
        
        // Update payment with gateway reference
        await Payment.findByIdAndUpdate(paymentRecord._id, {
            gatewayReference: response.data.data.reference,
            authorizationUrl: response.data.data.authorization_url
        });
        
        res.status(200).json({
            success: true,
            message: "Payment initialized successfully",
            data: {
                authorization_url: response.data.data.authorization_url,
                reference: reference
            }
        });
        
    } catch (error) {
        console.error("Payment initialization error:", error);
        
        let statusCode = 500;
        let errorMessage = "Failed to initialize payment";
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                statusCode = 502;
                errorMessage = error.response.data?.message || "Payment gateway error";
            } else if (error.request) {
                statusCode = 503;
                errorMessage = "Unable to reach payment gateway";
            }
        }
        
        res.status(statusCode).json({
            success: false,
            message: errorMessage
        });
    }
};

// Webhook to verify payment
export const verifyPayment = async (req, res) => {
    try {
        // Verify signature from Paystack
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');
        
        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        
        const event = req.body;
        
        if (event.event === 'charge.success') {
            const data = event.data;
            
            // Find payment record
            const payment = await Payment.findOne({ reference: data.reference });
            if (!payment) {
                return res.status(404).json({ success: false, message: "Payment not found" });
            }
            
            // Update payment status
            payment.status = "success";
            payment.verifiedAt = new Date();
            await payment.save();
            
            // Update user subscription
            const user = await User.findById(payment.userId);
            if (user) {
                user.isSubscribed = true;
                user.subscriptionPlan = payment.plan;
                
                // Set expiration date
                const expiresAt = new Date();
                if (payment.plan === "monthly") {
                    expiresAt.setMonth(expiresAt.getMonth() + 1);
                } else if (payment.plan === "annual") {
                    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                }
                
                user.subscriptionExpiresAt = expiresAt;
                await user.save();
                
                console.log(`Subscription updated for user ${user.email}`);
            }
            
            return res.status(200).json({ success: true, message: "Payment verified and subscription activated" });
        }
        
        res.status(200).json({ success: true, message: "Webhook received" });
        
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ success: false, message: "Webhook processing failed" });
    }
};
export const verifyPaymentCallback = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.redirect(`${process.env.FRONTEND_URL.replace(/\/$/, "")}/payment?status=error`);
    }

    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.redirect(`${process.env.FRONTEND_URL.replace(/\/$/, "")}/payment?status=failed`);
    }

    // Only verify if status is not already success
    if (payment.status !== "success") {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
      );

      if (response.data.data.status === "success") {
        payment.status = "success";
        payment.verifiedAt = new Date();
        await payment.save();

        const user = await User.findById(payment.userId);
        if (user) {
          user.isSubscribed = true;
          user.subscriptionPlan = payment.plan;

          const expiresAt = new Date();
          if (payment.plan === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
          else if (payment.plan === "annual") expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          user.subscriptionExpiresAt = expiresAt;
          await user.save();
        }
      }
    }

    // Redirect to frontend verification page with success param
    return res.redirect(
      `${process.env.FRONTEND_URL.replace(/\/$/, "")}/payment/verify?reference=${reference}&success=true`
    );

  } catch (error) {
    console.error("Payment callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL.replace(/\/$/, "")}/payment?status=error`);
  }
};
