// components/SideBar.tsx
import React from 'react'
import { 
  Home, 
  FileText, 
  Upload, 
  Settings, 
  Users,
  BookOpen,
  Grid,
  X
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SideBarProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface MenuItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  
  const menuItems: MenuItem[] = [
    { id: 1, name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
    { id: 2, name: 'Articles', icon: <FileText className="w-5 h-5" />, path: '/dashboard/articles' },
    { id: 3, name: 'Upload', icon: <Upload className="w-5 h-5" />, path: '/dashboard/upload' },
    { id: 4, name: 'Categories', icon: <Grid className="w-5 h-5" />, path: '/dashboard/categories' },
    { id: 5, name: 'Users', icon: <Users className="w-5 h-5" />, path: '/dashboard/users' },
    { id: 6, name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
  ]

  // Base classes for both mobile and desktop
  const baseClasses = "h-full w-64 bg-black text-white"
  
  // Mobile classes
  const mobileClasses = `fixed top-0 left-0 transform transition-transform duration-300 z-50 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`
  
  // Desktop classes
  const desktopClasses = "hidden md:block md:fixed md:top-0 md:left-0 md:h-screen"

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`${baseClasses} ${mobileClasses} md:hidden`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold">ArticleHub</h1>
          </div>

          {/* Close Button (mobile only) */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
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

      {/* Desktop Sidebar */}
      <div className={`${baseClasses} ${desktopClasses}`}>
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
    </>
  )
}

export default SideBar