import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import { useLocation } from "react-router-dom"
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import { Toaster } from "react-hot-toast";
import Article from "./pages/Article";
import ArticleDetail from "./pages/ArticleDetail";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

function App() {

  {/* Where to Show Nav Screens  */ }
  const location = useLocation();
  const path = ["/login", "/register"]
  const shouldHideBar = path.includes(location.pathname)

  const { user, getUser } = useAuthStore();

  console.log(user)

  useEffect(() => {
      getUser()
  }, [])


  return (

    <div>

      <Toaster position="bottom-right" reverseOrder={true} />

      {
        !shouldHideBar && <Navbar />
      }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<Article />} />
        <Route path="/article/:articleId" element={<ArticleDetail />} />
      </Routes>

    </div>
  )
}

export default App
