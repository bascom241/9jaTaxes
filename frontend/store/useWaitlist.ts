import { create } from "zustand";
import axiosInstance from "../src/lib/axios"

interface WaitlistData {
  fullName: string;
  email: string;
  interest?: string;
}

interface WaitlistStore {
  loading: boolean;
  joinWaitlist: (data: WaitlistData) => Promise<boolean>;
}

export const useWaitlist = create<WaitlistStore>((set) => ({
  loading: false,

  joinWaitlist: async (data) => {
    try {
      set({ loading: true });

      await axiosInstance.post("/waitlist", data); // adjust baseURL if needed

      set({ loading: false });
      return true;
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      set({ loading: false });
      return false;
    }
  },
}));
