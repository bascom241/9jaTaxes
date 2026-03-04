// components/users/SubscriptionModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import {useUserStore} from "../../../store/useUserStore"
import toast from 'react-hot-toast';

interface SubscriptionModalProps {
  user: any;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    subscriptionPlan: user.subscriptionPlan,
    isSubscribed: user.isSubscribed,
    subscriptionExpiresAt: user.subscriptionExpiresAt ? 
      new Date(user.subscriptionExpiresAt).toISOString().split('T')[0] : ''
  });
  
  const { updateUserSubscription, loading } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: any = {
      subscriptionPlan: formData.subscriptionPlan,
      isSubscribed: formData.subscriptionPlan !== 'free'
    };

    if (formData.subscriptionExpiresAt && formData.subscriptionPlan !== 'free') {
      data.subscriptionExpiresAt = new Date(formData.subscriptionExpiresAt);
    }

    const result = await updateUserSubscription(user._id, data);
    if (result.success) {
      toast.success('Subscription updated successfully');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Manage Subscription</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Plan
                </label>
                <select
                  value={formData.subscriptionPlan}
                  onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="free">Free</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              {formData.subscriptionPlan !== 'free' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.subscriptionExpiresAt}
                    onChange={(e) => setFormData({ ...formData, subscriptionExpiresAt: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    required
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;