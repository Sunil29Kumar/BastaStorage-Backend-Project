import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import LoginWithGoogle from "./LoginWithGoogle";
import LoginWithGithub from "./LoginWithGithub";
import TermsPrivacyFooter from "../Components/legal/TermsPrivacyFooter";

function Login() {
  const { loginData, setLoginData, handleLogin, loginError, loginLimiter, isDarkMode } =
    useContext(BastaStorageContext);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#0f1113]" : "bg-slate-50"}`}>

      {loginLimiter ? (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-3xl animate-bounce">
          <i className="ri-error-warning-line text-5xl text-red-500 mb-4 block"></i>
          <h1 className="text-xl font-bold text-red-600">{loginLimiter}</h1>
        </div>
      ) : (
        <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl transition-all border ${isDarkMode ? "bg-[#161b22] border-white/5 shadow-black/50" : "bg-white border-gray-100 shadow-blue-500/5"}`}>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center rounded-2xl bg-blue-600/10 mb-4">
              {/* LOGO */}
              <div className="  ">
                <img
                  src={`${isDarkMode ? "/basta logo.png" : "/bst logo.png"}`}
                  className="w-[4vw] cursor-pointer bg-black "
                  alt="logo"
                />
              </div>
            </div>
            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Login to Basta Storage
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Please enter your details</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={handleChange}
                required
                className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:ring-2 outline-none ${isDarkMode
                  ? "bg-gray-800/50 border-white/10 text-white focus:ring-blue-500/50"
                  : "bg-gray-50 border-gray-200 focus:ring-blue-500/20"
                  }`}
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="relative group">
              <i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                required
                className={`w-full pl-11 pr-12 py-3 rounded-xl border transition-all focus:ring-2 outline-none ${isDarkMode
                  ? "bg-gray-800/50 border-white/10 text-white focus:ring-blue-500/50"
                  : "bg-gray-50 border-gray-200 focus:ring-blue-500/20"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
              </button>
            </div>

            {/* Login Error Display */}
            {loginError && (
              <div className="">
                <p className="text-center text-red-500 text-xs font-bold ">
                  <i className="ri-error-warning-fill mr-1"></i> {loginError}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 text-white py-3 mt-2 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>

          {/* Redirect to Register */}
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Don’t have an account?{" "}
            <Link to="/Register" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
              Create one
            </Link>
          </p>

          {/* Social Divider */}
          <div className="flex items-center my-8">
            <div className={`flex-grow border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}></div>
            <span className="mx-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">OR CONTINUE WITH</span>
            <div className={`flex-grow border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}></div>
          </div>

          {/* Social Buttons Container */}
          <div className=" w-full  flex justify-center items-center gap-4 mb-8  ">
            <div className=""><LoginWithGoogle /></div>
            <div>{"|"}</div>
            <div className=" "><LoginWithGithub /></div>
          </div>

          <TermsPrivacyFooter />
        </div>
      )}
    </div>
  );
}

export default Login;