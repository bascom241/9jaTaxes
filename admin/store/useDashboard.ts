// store/dashboardStore.ts
import { create } from "zustand"
import axiosInstance from "../src/lib/axios";

interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
  totalComments: number;
  recentArticles: any[];
  popularCategories: { name: string; count: number }[];
  articlesByMonth: { month: number; count: number }[];
  userGrowth: { month: number; users: number }[];
}

interface DashboardStore {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: {
    totalUsers: 0,
    totalArticles: 0,
    totalCategories: 0,
    totalComments: 0,
    recentArticles: [],
    popularCategories: [],
    articlesByMonth: [],
    userGrowth: []
  },
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch all data in parallel from your backend endpoints
      const [usersRes, articlesRes, categoriesRes, commentsRes] = await Promise.all([
        axiosInstance.get("/admin/users/stats"),
        axiosInstance.get("/admin/articles/stats"),
        axiosInstance.get("/admin/categories/stats"),
        axiosInstance.get("/admin/comments/stats")
      ]);

      console.log("Users Stats:", usersRes.data);
      console.log("Articles Stats:", articlesRes.data);
      console.log("Categories Stats:", categoriesRes.data);
      console.log("Comments Stats:", commentsRes.data);

      set({
        stats: {
          totalUsers: usersRes.data.total || 0,
          totalArticles: articlesRes.data.total || 0,
          totalCategories: categoriesRes.data.total || 0,
          totalComments: commentsRes.data.total || 0,
          recentArticles: articlesRes.data.recent || [],
          popularCategories: categoriesRes.data.popular || [],
          articlesByMonth: articlesRes.data.byMonth || [],
          userGrowth: usersRes.data.growth || []
        },
        loading: false
      });
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      set({ 
        error: error.response?.data?.message || "Failed to fetch dashboard data", 
        loading: false 
      });
    }
  }
}));