// components/DashboardLayout.tsx
import React, { useState } from 'react'
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"
import SideBar from './SideBar'

const DashboardLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-black text-white p-4">
        <h1 className="text-lg font-bold">ArticleHub</h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex relative">
        {/* Overlay (mobile only) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar - fixed on desktop */}
        <div className="hidden md:block md:fixed md:left-0 md:top-0 md:h-full">
          <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        
        {/* Main Content - with proper margin on desktop */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout