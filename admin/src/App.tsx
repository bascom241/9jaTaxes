// App.tsx
import React from 'react'
import { Routes, Route } from "react-router-dom"
import News from './dashboard/News'
import DashboardLayout from "./components/DashboardLayout"
import DashboardOverview from "./dashboard/DashboardOverview"
import Upload from "./dashboard/Upload"
import Articles from "./dashboard/Articles"
import Categories from "./dashboard/Categories"
import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"
import Users from './dashboard/users'
import Settings from './dashboard/settings'

const App: React.FC = () => {
  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="upload" element={<Upload />} />
          <Route path="articles" element={<Articles />} />
          <Route path="categories" element={<Categories />} />
          <Route path='users' element={<Users/>}/>
          <Route path='settings' element={<Settings/>}/>
          <Route path='news' element={<News/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App