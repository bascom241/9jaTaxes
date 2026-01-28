import { useState } from "react";
import useAuthStore from "../../store/useAuth"

const Login = () => {

    const {login} = useAuthStore();

    const [formData,setFormData] = useState({email: "", password: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData((prev)=> {
            return {
                ...prev, [name]: value
            }
        })
    }
    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        login(formData)
    }


    
    return (
        <div className='flex items-center flex-col justify-center w-full h-screen bg-white'>
            <div className='flex items-center flex-col justify-center gap-5 border bg-white w-[80%] max-w-md px-8 py-8 border-gray-300 rounded-lg shadow-sm'>
                <h1 className='text-3xl font-bold text-gray-900'>Admin Login</h1>

                <form className='w-full flex items-center flex-col gap-5' onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-gray-900 font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white text-gray-900"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-900 font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            name="password"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white text-gray-900"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-3 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login