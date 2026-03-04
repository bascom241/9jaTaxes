// dashboard/Settings.tsx
import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, CreditCard,  Moon, Sun, User, Key } from 'lucide-react';
import { useUserStore } from "../../store/useUserStore";
import {useSettingsStore} from "../../store/useSettingsStore"
import toast from 'react-hot-toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import axiosInstance from '../lib/axios';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const { currentUser, fetchCurrentUser, updateUserProfile } = useUserStore();
  const { 
    notificationSettings, 
    theme, 
    updateNotificationSettings, 
    updateTheme,
    fetchSettings 
  } = useSettingsStore();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings);
  const [localTheme, setLocalTheme] = useState(theme);

  useEffect(() => {
    fetchCurrentUser();
    fetchSettings();
  }, [fetchCurrentUser, fetchSettings]);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  useEffect(() => {
    setLocalNotificationSettings(notificationSettings);
  }, [notificationSettings]);

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put('/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      await updateNotificationSettings(localNotificationSettings);
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    }
  };

  const handleThemeSave = async () => {
    try {
      await updateTheme(localTheme);
      toast.success('Theme updated successfully');
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  const handleBillingManage = () => {
    window.location.href = '/dashboard/billing';
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Sun },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg border p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={currentUser.role || 'user'}
                      disabled
                      className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-4 max-w-2xl">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.emailNotifications}
                      onChange={(e) => setLocalNotificationSettings({
                        ...localNotificationSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.pushNotifications}
                      onChange={(e) => setLocalNotificationSettings({
                        ...localNotificationSettings,
                        pushNotifications: e.target.checked
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Article Updates</p>
                      <p className="text-sm text-gray-500">Get notified when new articles are published</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.articleUpdates}
                      onChange={(e) => setLocalNotificationSettings({
                        ...localNotificationSettings,
                        articleUpdates: e.target.checked
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.marketingEmails}
                      onChange={(e) => setLocalNotificationSettings({
                        ...localNotificationSettings,
                        marketingEmails: e.target.checked
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </label>

                  <button
                    onClick={handleNotificationSave}
                    className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                <div className="space-y-4 max-w-2xl">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-3">Theme</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setLocalTheme('light')}
                        className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center gap-2 ${
                          localTheme === 'light' ? 'border-black bg-gray-100' : 'border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <Sun className="w-5 h-5" />
                        Light
                      </button>
                      <button
                        onClick={() => setLocalTheme('dark')}
                        className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center gap-2 ${
                          localTheme === 'dark' ? 'border-black bg-gray-100' : 'border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <Moon className="w-5 h-5" />
                        Dark
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleThemeSave}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Save Appearance
                  </button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-4">Current Plan</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold capitalize">
                          {currentUser.subscriptionPlan || 'Free'} Plan
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentUser.isSubscribed 
                            ? currentUser.subscriptionExpiresAt 
                              ? `Expires: ${new Date(currentUser.subscriptionExpiresAt).toLocaleDateString()}`
                              : 'Active subscription'
                            : 'Free tier with 5 messages per day'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        currentUser.isSubscribed 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {currentUser.isSubscribed ? 'Active' : 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-4">Usage Statistics</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Messages Used Today</span>
                          <span className="font-medium">{currentUser.freeMessagesUsed || 0}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full"
                            style={{ width: `${((currentUser.freeMessagesUsed || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Total Messages</span>
                          <span className="font-medium">{currentUser.totalMessagesUsed || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBillingManage}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Manage Billing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;