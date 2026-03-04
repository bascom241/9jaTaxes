// dashboard/Categories.tsx
import React, { useState, useEffect } from 'react'
import {useArticleStore} from '../../store/useArticle'
import type {  ICategory } from '../types'
import { Plus, Hash, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../ui/LoadingSpinner'

const Categories: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>('')
  const { categories, loading, fetchCategories, createCategory } = useArticleStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) {
      toast.error('Category name is required')
      return
    }

    const result = await createCategory(newCategory)
    if (result.success) {
      toast.success('Category created successfully')
      setNewCategory('')
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage article categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Category
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Existing Categories
            </h2>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat: ICategory) => (
                  <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{cat.name}</span>
                    <button className="p-1 hover:bg-gray-200 rounded text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories