// components/dashboard/RecentArticles.tsx
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { IArticle } from '../types';

interface RecentArticlesProps {
  articles: IArticle[];
}

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Articles</h3>
        <div className="text-center py-8 text-gray-500">
          No recent articles found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Articles</h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article._id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{article.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{article.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(article.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.timeTaken} min read
                </span>
              </div>
            </div>
            <span className="px-2 py-1 bg-gray-100 text-xs rounded whitespace-nowrap">
              {typeof article.articleCategory === 'object' && article.articleCategory !== null
                ? article.articleCategory.name 
                : 'Uncategorized'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentArticles;