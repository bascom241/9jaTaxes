import  { useState } from "react";
import {useAuthStore} from "../../../store/authStore"
const Login = () => {

  const {login} = useAuthStore()
  const [formData , setFormData] = useState({email: "", password: ""})


  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value } = e.target;
    setFormData((prev)=> {
      return {
        ...prev, [name]: value
      }
    })
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-green-800 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
