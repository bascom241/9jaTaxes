import { create } from "zustand"
import axiosInstance from "../src/lib/axios"
import toast from "react-hot-toast"

interface AuthInterface {
    isLogin: boolean
    isRegister: boolean
    login: (formData: userLoginFormData) => Promise<void>
    register: (formData: userRegisterFormData) => Promise<void>
    loginError: string | null
    user: User | null
    getUser: () => Promise<User | void>
    logout: () => void
}

type userLoginFormData = {
    email: string
    password: string
}

type userRegisterFormData = {
    name: string
    email: string
    password: string
    role?: string
}

type User = {
    name: string
    email: string
    role?: string
    _id: string
}

const authKey = "authToken"

export const useAuthStore = create<AuthInterface>((set) => ({
    isLogin: false,
    isRegister: false,
    loginError: null,
    user: null,

    login: async (formData) => {
        set({ isLogin: true })
        try {
            const response = await axiosInstance.post("/login", formData);
            const { token } = response.data.data;

            localStorage.setItem(authKey, token);

            toast.success("Login successful")
            window.location.href = "/"

            set({ isLogin: false })
        } catch (error) {
            set({ isLogin: false })
            toast.error("Failed to login")
        }
    },

    register: async (formData) => {
        set({ isRegister: true })
        try {
            await axiosInstance.post("/register", formData);
            toast.success("Registration successful")
            window.location.href = "/login"
            set({ isRegister: false })
        } catch (error) {
            toast.error("Registration Failed")
            set({ isRegister: false })
        }
    },

    getUser: async () => {
        try {
            const response = await axiosInstance.get("/user");
            set({ user: response.data.user });
            return response.data.user
        } catch (error) {
            // If token invalid → auto logout
            localStorage.removeItem(authKey);
            set({ user: null });
        }
    },

    logout: () => {
        localStorage.removeItem(authKey);
        set({ user: null });
        toast.success("Logged out successfully");
        window.location.href = "/login";
    }
}))
