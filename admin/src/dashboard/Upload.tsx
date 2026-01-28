import React, { useState } from 'react'
import { Upload as UploadIcon, Image, X, Save, Eye, Tag, Hash, Clock } from 'lucide-react'

const Upload = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isDraft, setIsDraft] = useState(false)

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // Handle article submission
    console.log({
      title,
      content,
      category,
      tags,
      image,
      isDraft
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upload Article</h1>
          <p className="text-gray-600">Create and publish new articles</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsDraft(true)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-2"
          >
            <UploadIcon className="w-4 h-4" />
            Publish Article
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white border rounded-lg p-6">
            <label className="block text-sm font-medium mb-2">Article Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Content */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">Content</label>
              <div className="flex gap-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              rows={12}
              className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="border rounded p-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-xs rounded"
                    >
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-gray-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag and press Enter"
                  className="w-full p-2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  )
}

export default Upload