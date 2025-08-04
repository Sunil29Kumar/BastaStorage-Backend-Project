import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import LoginWithGoogle from "./LoginWithGoogle";
// import OTP from "./OTP";

function Login() {
  const { loginData, setLoginData, handleLogin, loginError } =
    useContext(BastaStorageContext);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 py-5 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className=" text-center text-red-500 ">{loginError}</p>
        </form>

        <div>

          <p className="text-center text-sm text-gray-600  mt-4">
            Don’t have an account?{" "}
            <Link
              to="/Register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
         <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <LoginWithGoogle /> 
      </div>
    </div>
  );
}

export default Login;
