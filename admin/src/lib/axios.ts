import axios from "axios"

const localBaseURL ="http://localhost:5000/api" 
console.log(localBaseURL)
const renderBaseUrl = "https://9jataxes.pxxl.click/api"
 const axiosInstance = axios.create({
    baseURL: renderBaseUrl,
    withCredentials: true
});


const publicRoutes = ["/login"]


axiosInstance.interceptors.request.use((config)=> {
    const isPublicRoute = publicRoutes.some(url => config.url?.includes(url));

    if(!isPublicRoute){
        const token = localStorage.getItem("authToken");

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
    }

    return config


}, (error) => Promise.reject(error))


export default axiosInstance