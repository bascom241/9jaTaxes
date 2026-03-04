import { create } from "zustand";
import axiosInstance from "../src/lib/axios";
import toast from "react-hot-toast";
interface LoginData {
  email: string;
  password: string;
}



interface AuthStore {
  gettingUser: boolean;
  login: (formData: LoginData) => Promise<void>;
}

const authKey = "authToken";
const useAuthStore = create<AuthStore>(() => ({
  gettingUser: false,
  login: async (formData) => {
    try {
      const response = await axiosInstance.post("/login", formData);
      console.log(response.data.data);
      const userRole = response?.data.data.role;
      localStorage.setItem(authKey, response?.data.data.token);
      if (userRole === "admin") {
        toast.success("Login succesfully");
        window.location.href = "/dashboard";
        localStorage.setItem(authKey, response?.data.data.token);
      } else {
        window.location.href="/login"
        toast.error("Acess Denied")
      }
    } catch (error) {
      toast.error("Failed to login");
    }
  },

  getUsers:async() => {
    try {
      
    } catch (error) {
      
    }
  }
  
}));

export default useAuthStore;
