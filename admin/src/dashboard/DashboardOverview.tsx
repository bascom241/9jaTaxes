// dashboard/DashboardOverview.tsx
import React, { useEffect, useState } from 'react';
import { Users, FileText, MessageCircle, Layers } from 'lucide-react';
import Box from '../../ui/Box';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BartChart';
import DoughnutChart from '../components/charts/DoughnutChart';
import RecentArticles from '../components/RecentArticles';
import { useDashboardStore } from '../../store/useDashboard';
import { useArticleStore } from '../../store/useArticle';
import LoadingSpinner from '../../ui/LoadingSpinner';

// Helper function to convert month number to name
const getMonthName = (month: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || `Month ${month}`;
};

const DashboardOverview: React.FC = () => {
  const { stats, loading, fetchDashboardStats } = useDashboardStore();
  const { fetchArticles} = useArticleStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchDashboardStats();
    fetchArticles({ limit: 5 }); // Fetch 5 most recent articles
  }, []);

  // Prepare chart data from real stats
  const articlesByMonthData = {
    labels: stats.articlesByMonth.map(item => getMonthName(item.month)),
    values: stats.articlesByMonth.map(item => item.count)
  };

  const userGrowthData = {
    labels: stats.userGrowth.map(item => getMonthName(item.month)),
    values: stats.userGrowth.map(item => item.users)
  };

  const popularCategoriesData = {
    labels: stats.popularCategories.map(item => item.name),
    values: stats.popularCategories.map(item => item.count)
  };

  // Calculate trends (you can calculate these from your data)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 100, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Number(change.toFixed(1))),
      isPositive: change >= 0
    };
  };

 

  const articleTrend = stats.articlesByMonth.length >= 2 
    ? calculateTrend(
        stats.articlesByMonth[stats.articlesByMonth.length - 1]?.count || 0,
        stats.articlesByMonth[stats.articlesByMonth.length - 2]?.count || 0
      )
    : { value: 0, isPositive: true };

  const userTrend = stats.userGrowth.length >= 2
    ? calculateTrend(
        stats.userGrowth[stats.userGrowth.length - 1]?.users || 0,
        stats.userGrowth[stats.userGrowth.length - 2]?.users || 0
      )
    : { value: 0, isPositive: true };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Box
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 sm:w-8 sm:h-8" />}
          trend={userTrend}
        />
        <Box
          title="Total Articles"
          value={stats.totalArticles.toLocaleString()}
          icon={<FileText className="w-6 h-6 sm:w-8 sm:h-8" />}
          trend={articleTrend}
        />
        <Box
          title="Total Categories"
          value={stats.totalCategories.toLocaleString()}
          icon={<Layers className="w-6 h-6 sm:w-8 sm:h-8" />}
        />
        <Box
          title="Total Comments"
          value={stats.totalComments.toLocaleString()}
          icon={<MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Articles Over Time */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg font-semibold mb-2 sm:mb-0">Articles Over Time</h3>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-full capitalize ${
                    timeRange === range
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          {articlesByMonthData.labels.length > 0 ? (
            <LineChart 
              data={articlesByMonthData} 
              title="Articles Published"
              color="#000000"
            />
          ) : (
            <div className="h-75 flex items-center justify-center text-gray-500">
              No article data available
            </div>
          )}
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-6">User Growth</h3>
          {userGrowthData.labels.length > 0 ? (
            <LineChart 
              data={userGrowthData} 
              title="New Users"
              color="#2563eb"
            />
          ) : (
            <div className="h-75 flex items-center justify-center text-gray-500">
              No user data available
            </div>
          )}
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Popular Categories */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-6">Popular Categories</h3>
          {popularCategoriesData.labels.length > 0 ? (
            <DoughnutChart 
              data={popularCategoriesData} 
              title="Articles by Category"
            />
          ) : (
            <div className="h-75 flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
          {popularCategoriesData.labels.length > 0 ? (
            <BarChart 
              data={popularCategoriesData} 
              title="Articles per Category"
              color="#333333"
            />
          ) : (
            <div className="h-75 flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Articles Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentArticles articles={stats.recentArticles} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Avg Articles/Month</span>
              <span className="font-semibold">
                {stats.articlesByMonth.length > 0
                  ? Math.round(stats.articlesByMonth.reduce((acc, curr) => acc + curr.count, 0) / stats.articlesByMonth.length)
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Most Popular Category</span>
              <span className="font-semibold">
                {stats.popularCategories[0]?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Comments per Article</span>
              <span className="font-semibold">
                {stats.totalArticles > 0
                  ? (stats.totalComments / stats.totalArticles).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Categories Used</span>
              <span className="font-semibold">{stats.totalCategories}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Performance</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-medium">
                    {stats.totalArticles > 0
                      ? Math.round((stats.totalComments / stats.totalArticles) * 10)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full" 
                    style={{ 
                      width: `${stats.totalArticles > 0
                        ? Math.min((stats.totalComments / stats.totalArticles) * 10, 100)
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;