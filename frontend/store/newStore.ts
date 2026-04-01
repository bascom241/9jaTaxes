import { create } from "zustand";

import axiosInstance from "../src/lib/axios";

type NewsType = {
  _id: string;
  title: string;
  content: string;
  whatChanged: string;
  whoItAffects: string;
  createdAt: string;
};

type NewsStore = {
  news: NewsType[];
  fetchNews: () => Promise<void>;
};

export const useNewsStore = create<NewsStore>((set) => ({
  news: [],

  fetchNews: async () => {
    try {
      const res = await axiosInstance.get("/news");
      set({ news: res.data });
    } catch (error) {
      console.log(error);
    }
  },
}));