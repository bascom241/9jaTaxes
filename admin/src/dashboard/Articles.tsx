// dashboard/Articles.tsx
import React, { useState, useEffect } from 'react'
import {useArticleStore} from '../../store/useArticle'
import type {  IArticle} from '../types'
import { Edit, Trash2, Clock, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'

import toast from 'react-hot-toast'
import LoadingSpinner from '../../ui/LoadingSpinner'

const Articles: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  
  const { 
    articles, 
    categories, 
    pagination, 
    loading, 
    fetchArticles,
    fetchCategories,
    deleteArticle 
  } = useArticleStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchArticles({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { catId: selectedCategory })
      })
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [currentPage, searchTerm, selectedCategory])

  const handleDelete = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const result = await deleteArticle(articleId)
      if (result.success) {
        toast.success('Article deleted successfully')
      }
    }
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Articles</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your articles</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 p-3 bg-white border rounded-lg flex items-center justify-between"
        >
          <span className="font-medium">Filters</span>
          <Filter className="w-5 h-5" />
        </button>

        {/* Filter Controls */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white border rounded-lg p-4`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm sm:text-base"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full lg:w-48 p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table/Cards */}
      {loading ? (
        <LoadingSpinner />
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No articles found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Read Time</th>
                  <th className="text-left p-4 font-medium">Published</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article: IArticle) => (
                  <tr key={article._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{article.title}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                      {article.description}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {typeof article.articleCategory === 'object' 
                          ? article.articleCategory.name 
                          : 'Category'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {article.timeTaken} min
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(article.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(article._id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {articles.map((article: IArticle) => (
              <div key={article._id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{article.title}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                    {typeof article.articleCategory === 'object' 
                      ? article.articleCategory.name 
                      : 'Category'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {article.timeTaken} min
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(article._id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalArticles)} of {pagination.totalArticles}
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
    </div>
  )
}

export default Articles