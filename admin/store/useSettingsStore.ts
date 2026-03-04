// store/useSettingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../src/lib/axios";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  articleUpdates: boolean;
  marketingEmails: boolean;
}

interface SettingsStore {
  notificationSettings: NotificationSettings;
  theme: 'light' | 'dark';
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notificationSettings: {
        emailNotifications: true,
        pushNotifications: false,
        articleUpdates: true,
        marketingEmails: false,
      },
      theme: 'light',
      loading: false,

      fetchSettings: async () => {
        try {
          set({ loading: true });
          const response = await axiosInstance.get('/settings');
          if (response.data.success) {
            set({ 
              notificationSettings: response.data.notificationSettings,
              theme: response.data.theme 
            });
          }
        } catch (error) {
          console.error('Failed to fetch settings:', error);
        } finally {
          set({ loading: false });
        }
      },

      updateNotificationSettings: async (settings: NotificationSettings) => {
        try {
          set({ loading: true });
          const response = await axiosInstance.put('/settings/notifications', settings);
          if (response.data.success) {
            set({ notificationSettings: settings });
          }
        } catch (error) {
          console.error('Failed to update notification settings:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateTheme: async (theme: 'light' | 'dark') => {
        try {
          set({ loading: true });
          const response = await axiosInstance.put('/settings/theme', { theme });
          if (response.data.success) {
            set({ theme });
            // Apply theme to document
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        } catch (error) {
          console.error('Failed to update theme:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);