// lib/axios.ts
import axios from "axios";

const deployedBaseURL = "https://9ja-taxes.vercel.app/api"
const localBaseURL = "http://localhost:5000/api"
const renderBaseUrl = "https://9jataxes.pxxl.click/api"

console.log(localBaseURL)
console.log(deployedBaseURL)
const axiosInstance = axios.create({
  baseURL: renderBaseUrl,
  withCredentials: true
});

const publicUrls = ["/register", "/login", "/article/all"];

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicRoute = publicUrls.some(url => config.url?.includes(url));

    if (!isPublicRoute) {
      const token = localStorage.getItem("authToken");
      console.log("Token in interceptor:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
