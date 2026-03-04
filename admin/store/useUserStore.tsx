// store/userStore.ts
import { create } from "zustand"
import axiosInstance from "../src/lib/axios";
import toast from "react-hot-toast";
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isSubscribed: boolean;
  subscriptionPlan: 'free' | 'monthly' | 'annual';
  subscriptionExpiresAt?: string;
  freeMessagesUsed: number;
  totalMessagesUsed: number;
  lastResetDate: string;
  createdAt: string;
  updatedAt: string;
}

interface UserFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  role?: string;
  subscription?: string;
}

interface UserStore {
  users: IUser[];
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
  };

  // User APIs
  fetchUsers: (params?: UserFilters) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (userId: string, userData: Partial<IUser>) => Promise<{ success: boolean; data?: IUser }>;
  deleteUser: (userId: string) => Promise<{ success: boolean }>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<{ success: boolean }>;
  updateUserSubscription: (userId: string, subscriptionData: Partial<IUser>) => Promise<{ success: boolean }>;
  resetUserMessages: (userId: string) => Promise<{ success: boolean }>;
   updateUserProfile: (data: Partial<IUser>) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  },

  // Fetch all users (admin only)
  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const response = await axiosInstance.get(`/get-all-users?${queryParams}`);
      
      set({
        users: response.data.data,
        pagination: {
          page: response.data.page,
          totalPages: response.data.totalPages,
          totalUsers: response.data.totalUsers,
          limit: params.limit || 10
        },
        loading: false
      });
    } catch (error: any) {
        console.log(error)
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        loading: false
      });
    }
  },

  // Fetch current user profile
  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/user");
      set({ currentUser: response.data.user, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch user",
        loading: false
      });
    }
  },

  // Update user (admin only)
  updateUser: async (userId: string, userData: Partial<IUser>) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/user/${userId}`, userData);
      
      // Refresh list
      const { pagination } = get();
      await get().fetchUsers({ page: pagination.page, limit: pagination.limit });
      
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update user";
      set({ error: errorMessage, loading: false });
      return { success: false };
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/user/${userId}`);
      
      // Refresh list
      const { pagination } = get();
      await get().fetchUsers({ page: pagination.page, limit: pagination.limit });
      
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete user";
      set({ error: errorMessage, loading: false });
      return { success: false };
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId: string, role: 'user' | 'admin') => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/user/${userId}/role`, { role });
      
      // Refresh list
      const { pagination } = get();
      await get().fetchUsers({ page: pagination.page, limit: pagination.limit });
      
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update role";
      set({ error: errorMessage, loading: false });
      return { success: false };
    }
  },

  // Update user subscription (admin only)
  updateUserSubscription: async (userId: string, subscriptionData: Partial<IUser>) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/user/${userId}/subscription`, subscriptionData);
      
      // Refresh list
      const { pagination } = get();
      await get().fetchUsers({ page: pagination.page, limit: pagination.limit });
      
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update subscription";
      set({ error: errorMessage, loading: false });
      return { success: false };
    }
  },

  // Reset user's free message count (admin only)
  resetUserMessages: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(`/user/${userId}/reset-messages`);
      
      // Refresh list
      const { pagination } = get();
      await get().fetchUsers({ page: pagination.page, limit: pagination.limit });
      
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset messages";
      set({ error: errorMessage, loading: false });
      return { success: false };
    }
  },
   updateUserProfile: async (data: Partial<IUser>) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put('/auth/profile', data);
      if (response.data.success) {
        set({ currentUser: response.data.user });
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));