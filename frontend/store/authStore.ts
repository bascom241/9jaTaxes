import { create } from "zustand"
import axiosInstance from "../src/lib/axios"
import toast from "react-hot-toast"
interface AuthInterface {
    isLogin: boolean
    isRegister: boolean
    login: (formData: userLoginFormData) => Promise<void>
    register: (formData: userRegisterFormData) => Promise<void>
    loginError: string | null
    user:User | null
    getUser: ()  => Promise<User>
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
    _id:string
}

const authKey = "authToken"
const refreshToken = "refreshToken"
console.log(refreshToken)

export const useAuthStore = create<AuthInterface>((set) => ({
    isLogin: false,
    isRegister: false,
    loginError: null,
    user: null, 
    login: async (formData) => {
        set({ isLogin: true })
        try {
            const response = await axiosInstance.post("/login", formData);
            console.log(response) // to be removed
            const { token } = response.data;
            localStorage.setItem(authKey, token);
            window.location.href = "/"
            toast.success("login successful")
            set({isLogin: false })
        } catch (error) {
            toast.error("Failed to login")
            console.log(error)
            set({isLogin: false })
        }
    },
    register: async (formData) => {
        set({ isRegister: true })
        try {
            const response = await axiosInstance.post("/register", formData);
            toast.success("registeration successful")
            window.location.href = "/login"
            console.log(response) 
            set({isRegister: false })// to be removed
        } catch (error) {
            toast.error("Registeration Failed")
            set({isRegister: false })
            console.log(error)
        }
    },

    getUser: async () => {
        console.log("fetching ......")
        try {
            const response = await axiosInstance.get("/user");
            console.log(response)
            set({user: response.data.user});
            return response.data.user
        } catch (error) {
            toast.error("Failed to get user")
            console.log(error)
        }
    }

}))