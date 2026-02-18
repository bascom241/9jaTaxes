import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import { Toaster } from "react-hot-toast";
import Article from "./pages/Article";
import ArticleDetail from "./pages/ArticleDetail";
import PaymentVerify from "./pages/payments/Payment";// import the verify page
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import Footer from "./components/Footer";
import { jwtDecode, type JwtPayload } from "jwt-decode";





function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const shouldHideBar = hideNavbarPaths.includes(location.pathname);

  const { getUser } = useAuthStore();

useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (!decoded.exp || decoded.exp < currentTime) {
      // Token expired
      useAuthStore.getState().logout();
    } else {
      getUser();
    }
  } catch (error) {
    useAuthStore.getState().logout();
  }
}, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={true} />

      {!shouldHideBar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<Article />} />
        <Route path="/article/:articleId" element={<ArticleDetail />} />

        {/* Payment verification route */}
        <Route path="/payment/verify" element={<PaymentVerify />} />
      </Routes>

      {!shouldHideBar && <Footer />}
    </div>
  );
}

export default App;
