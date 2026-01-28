import React from 'react'
import { 
  Home, 
  FileText, 
  Upload, 
  BarChart, 
  Settings, 
  Users,
  LogOut,
  BookOpen,
  Grid
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const SideBar = () => {
  const location = useLocation()
  
  const menuItems = [
    { id: 1, name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
    { id: 2, name: 'Articles', icon: <FileText className="w-5 h-5" />, path: '/dashboard/articles' },
    { id: 3, name: 'Upload', icon: <Upload className="w-5 h-5" />, path: '/dashboard/upload' },
    { id: 4, name: 'Analytics', icon: <BarChart className="w-5 h-5" />, path: '/dashboard/analytics' },
    { id: 5, name: 'Categories', icon: <Grid className="w-5 h-5" />, path: '/dashboard/categories' },
    { id: 6, name: 'Users', icon: <Users className="w-5 h-5" />, path: '/dashboard/users' },
    { id: 7, name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
  ]

  return (
    <div className="w-64 bg-black text-white min-h-screen border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold">ArticleHub</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-white text-black' 
                  : 'hover:bg-gray-900 text-gray-300'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      
   
    </div>
  )
}

export default SideBar