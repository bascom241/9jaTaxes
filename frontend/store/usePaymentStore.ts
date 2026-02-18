import toast from "react-hot-toast"
import {create} from "zustand"
import axiosInstance from "../src/lib/axios"
interface VerifyPaymentResponse {
  success: boolean
  message?: string
}

interface PaymentState {
  initializePayment: (plan: "monthly" | "annual") => Promise<void>
  verifyPayment: (reference: string) => Promise<VerifyPaymentResponse> // <-- update this
  isLoading: boolean
}

export const usePayment = create<PaymentState>((set) => ({
  isLoading: false,

  initializePayment: async (plan) => {
    try {
      set({ isLoading: true })
      const response = await axiosInstance.post("/payments/initialize", { plan })

      if (response.data.success && response.data.data.authorization_url) {
        window.location.href = response.data.data.authorization_url
      } else {
        toast.error("Failed to initialize payment")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      toast.error(error.response?.data?.message || "Payment initialization failed")
    } finally {
      set({ isLoading: false })
    }
  },

  // Verify payment manually (webhook-safe)
  verifyPayment: async (reference) => {
    try {
      set({ isLoading: true });

    const response = await axiosInstance.get(`/payments/verify?reference=${reference}`);


      // Paystack / backend may have already marked it success via webhook
      const success = response.data.success || response.data.status === "success";

      if (success) {
        toast.success("🎉 Payment verified successfully!");
      } else {
        toast.error(response.data.message || "Payment verification failed");
      }

      return {
        success,
        message: response.data.message || (success ? "Payment verified" : "Verification failed"),
      };
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast.error(error.response?.data?.message || "Error verifying payment");
      return { success: false, message: "Error verifying payment" };
    } finally {
      set({ isLoading: false });
    }
  },
}))
