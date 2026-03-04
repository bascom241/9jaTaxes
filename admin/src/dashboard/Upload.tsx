// dashboard/Upload.tsx
import React, { useState, useEffect } from 'react'
import { Upload as UploadIcon, Eye, Hash, Clock, AlertCircle } from 'lucide-react'
import {useArticleStore} from '../../store/useArticle'
import type {  IArticleFormData} from '../types'
import toast from 'react-hot-toast'

interface FormErrors {
  title?: string;
  description?: string;
  content?: string;
  articleCategory?: string;
}

const Upload: React.FC = () => {
  const [formData, setFormData] = useState<IArticleFormData>({
    title: '',
    description: '',
    content: '',
    articleCategory: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const { categories, fetchCategories, createArticle, loading } = useArticleStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.articleCategory) newErrors.articleCategory = 'Category is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fill all required fields')
      return
    }

    const result = await createArticle(formData)
    if (result.success) {
      toast.success('Article uploaded successfully!')
      setFormData({
        title: '',
        description: '',
        content: '',
        articleCategory: ''
      })
    }
  }

  const getReadTime = (): number => {
    if (!formData.content) return 0
    const wordsPerMinute = 200
    const wordCount = formData.content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload Article</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Create and publish new articles</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <UploadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white border rounded-lg p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white border rounded-lg p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the article"
              rows={3}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="bg-white border rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <label className="text-sm font-medium">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {formData.content && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{getReadTime()} min read</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Preview</span>
                </div>
              </div>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article content here..."
              rows={12}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.content}
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white border rounded-lg p-4 sm:p-6">
            <label className="text-sm font-medium mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="articleCategory"
              value={formData.articleCategory}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base ${
                errors.articleCategory ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.articleCategory && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.articleCategory}
              </p>
            )}
          </div>

          {/* Article Stats */}
          {formData.content && (
            <div className="bg-white border rounded-lg p-4 sm:p-6">
              <h3 className="font-medium mb-3 text-sm sm:text-base">Article Stats</h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Words:</span>
                  <span className="font-medium">{formData.content.trim().split(/\s+/).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Read time:</span>
                  <span className="font-medium">{getReadTime()} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Characters:</span>
                  <span className="font-medium">{formData.content.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload