import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";

const Register = () => {
  const { register, isRegister } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
            required
          />

          <button
            type="submit"
            disabled={isRegister}
            className={`w-full bg-green-800 text-white py-2 rounded-md font-semibold transition flex items-center justify-center ${
              isRegister ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {isRegister ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {isRegister ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-800 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
