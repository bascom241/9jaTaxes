import { create } from "zustand";
import axiosInstance from "../src/lib/axios";

interface NewsStore {
    loading: boolean
    createNews: (data: any) => Promise<void>
}

export const useAdminNewsStore = create<NewsStore>((set) => ({
  loading: false,

  createNews: async (data: any) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/news", data);
      set({ loading: false });
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },
}));