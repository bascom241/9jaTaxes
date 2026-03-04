// dashboard/Users.tsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  UserCog,
  Crown,
  Mail,
  Calendar,
  
  MoreVertical,
  Shield,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import LoadingSpinner from '../../ui/LoadingSpinner';
import toast from 'react-hot-toast';
import EditUserModal from '../components/users/EditUserModal';
import SubscriptionModal from '../components/users/SubscriptionModal';

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const { users, pagination, loading, fetchUsers, deleteUser, updateUserRole, resetUserMessages } = useUserStore();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole && { role: selectedRole }),
        ...(selectedSubscription && { subscription: selectedSubscription })
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm, selectedRole, selectedSubscription]);

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success('User deleted successfully');
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast.success(`User role updated to ${newRole}`);
    }
  };

  const handleResetMessages = async (userId: string) => {
    if (window.confirm('Reset free message count for this user?')) {
      const result = await resetUserMessages(userId);
      if (result.success) {
        toast.success('Message count reset successfully');
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

const getSubscriptionBadge = (user: any) => {
  if (!user.isSubscribed) {
    return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Free</span>;
  }
  
  const colors = {
    monthly: 'bg-blue-100 text-blue-600',
    annual: 'bg-purple-100 text-purple-600'
  };
  
  // Type assertion - tell TypeScript that subscriptionPlan is a key of colors
  const plan = user.subscriptionPlan as keyof typeof colors;
  
  return (
    <span className={`px-2 py-1 ${colors[plan]} text-xs rounded-full flex items-center gap-1`}>
      <Crown className="w-3 h-3" />
      {user.subscriptionPlan}
    </span>
  );
};

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <span className="px-2 py-1 bg-black text-white text-xs rounded-full flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Admin
      </span>
    ) : (
      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
        <UserIcon className="w-3 h-3" />
        User
      </span>
    );
  };

  const getMessageUsage = (user: any) => {
    const used = user.freeMessagesUsed;
    const total = user.isSubscribed ? '∞' : 5;
    const percentage = user.isSubscribed ? 100 : (used / 5) * 100;
    
    return (
      <div className="w-24">
        <div className="flex justify-between text-xs mb-1">
          <span>{used}/{total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${user.isSubscribed ? 'bg-purple-500' : 'bg-blue-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage users, roles, and subscriptions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 p-3 bg-white border rounded-lg flex items-center justify-between"
        >
          <span className="font-medium">Filters</span>
          <Filter className="w-5 h-5" />
        </button>

        <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white border rounded-lg p-4`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm sm:text-base"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full lg:w-48 p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm sm:text-base"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
              className="w-full lg:w-48 p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm sm:text-base"
            >
              <option value="">All Plans</option>
              <option value="free">Free</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table/Cards */}
      {users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Subscription</th>
                  <th className="text-left p-4 font-medium">Messages</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4">{getSubscriptionBadge(user)}</td>
                    <td className="p-4">{getMessageUsage(user)}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === user._id ? null : user._id)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {actionMenu === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit User
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowSubscriptionModal(true);
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Crown className="w-4 h-4" />
                              Manage Subscription
                            </button>
                            <button
                              onClick={() => {
                                handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin');
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <UserCog className="w-4 h-4" />
                              Toggle Admin
                            </button>
                            <button
                              onClick={() => {
                                handleResetMessages(user._id);
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Reset Messages
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(user._id, user.name);
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenu(actionMenu === user._id ? null : user._id)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {actionMenu === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                            setActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit User
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowSubscriptionModal(true);
                            setActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Crown className="w-4 h-4" />
                          Manage Subscription
                        </button>
                        <button
                          onClick={() => {
                            handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin');
                            setActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserCog className="w-4 h-4" />
                          Toggle Admin
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(user._id, user.name);
                            setActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {getRoleBadge(user.role)}
                  {getSubscriptionBadge(user)}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Messages Used</span>
                    {getMessageUsage(user)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
              </div>
              <div className="flex gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border rounded-lg bg-gray-50 text-sm">
                  {currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showSubscriptionModal && selectedUser && (
        <SubscriptionModal
          user={selectedUser}
          onClose={() => {
            setShowSubscriptionModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;