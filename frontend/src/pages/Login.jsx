import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Allapi from "../common";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { ThemeContext } from "../store/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { theme } = useContext(ThemeContext);

  const token = localStorage.getItem("token");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(Allapi.login.url, {
        method: Allapi.login.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.data));
        
        // Set expiry time (2 hours)
        const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem("expiryTime", expiryTime.toString());

        toast.success(data.message);

        console.log("Login successful for role:", data.data.role);
        
        // Role-based navigation
        switch (data.data.role) {
          case "MainAdmin":
            navigate("/admin");
            break;
          case "BranchAdmin":
            navigate("/branch-admin");
            break;
          case "Teacher":
            navigate("/teacher");
            break;
          case "Student":
            navigate("/student");
            break;
          case "Account":
            console.log("Navigating to accountant dashboard");
            navigate("/accountant");
            break;
          default:
            console.error("Invalid role:", data.data.role);
            toast.error(`Invalid role: ${data.data.role}`);
        }
      } else {
        console.error("Login failed:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  if (token) {
    return (
      <>
        <Header />
        <div className={`flex items-center justify-center min-h-[50vh] ${theme === 'light' ? 'text-gray-800' : 'text-white'} responsive-p`}>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">You are logged in</h2>
            <p className="mb-4">You are already logged into your account.</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`flex items-center justify-center flex-1 min-h-screen px-4 py-8 sm:px-6 lg:px-8 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="w-full max-w-md mx-auto">
          <div className="mx-3 sm:mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
            <div className={`rounded-t-[1.3rem] ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} px-4 sm:px-8 py-6 sm:py-10`}>
              <div className="flex justify-center mb-4 sm:mb-6">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                />
              </div>
              <h2 className={`mb-4 text-center text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Sign in to your account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
                  >
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-300 text-gray-900' : 'border-gray-600 text-white bg-gray-700'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
                  >
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-300 text-gray-900' : 'border-gray-600 text-white bg-gray-700'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter your password"
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash className={`h-5 w-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <FaEye className={`h-5 w-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div className={`mt-4 sm:mt-6 text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                <p>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Contact Administrator
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;