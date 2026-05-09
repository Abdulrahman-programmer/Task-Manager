import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL ;
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const payload = Object.fromEntries(new FormData(form));

        try {
            const response = await axios.post("/api/auth/login", payload);
            sessionStorage.setItem("token", response.data.token);
            if (response.status === 200) {
                setLoading(false);
                navigate("/dashboard");
            }else {
                console.log(response);
            }
        } catch (error) {
            alert("Login failed. Please check your credentials and try again.");
            console.log(error);
        }
        setLoading(false);
    }
  return (
    <>
     {loading && <Loading text="Logging in..." />}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto dark:hidden"
          />
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto not-dark:hidden"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="flex text-sm/6 font-medium text-black dark:text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Password
                </label>
                
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type= {showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-start">
                <input type="checkbox" name="showPassword" id="showPassword" className="py-1.5"
                onChange={() => setShowPassword(!showPassword)}/>
                <label htmlFor="showPassword" className="ml-2.5  text-sm/6 font-medium text-black dark:text-gray-100">
                Show password</label>
            </div>
            
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
            <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">    
                Don't have an account?{" "}
                <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400">
                  Sign up
                </a>
            </p>
        </div>
      </div>
    </>
  )
}
