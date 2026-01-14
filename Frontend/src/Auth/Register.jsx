import { useContext } from "react";
import { Link } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import OTP from "./OTP.jsx";
import LoginWithGoogle from "./LoginWithGoogle.jsx";
import LoginWithGithub from "./LoginWithGithub.jsx";
import TermsPrivacyFooter from "../Components/legal/TermsPrivacyFooter.jsx";
import { useState } from "react";

function Register() {
  const {
    registerData,
    setRegisterData,
    handleRegister,
    errorRegister,
    otpError,
    isVerifyOtpWrong,
    registerLimiterError,
    isDarkMode,
    otpSent,
    isClickOnRegisterButton,
    isGoogleLoginLoading
  } = useContext(BastaStorageContext);

  const [showPassword, setShowPassword] = useState(false);
  console.log(otpError?.name);


  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Reusable Error Component for consistency
  const ErrorMsg = ({ msg }) => (
    msg ? <p className="text-[11px] text-red-500 mt-1 ml-1 animate-pulse font-medium">
      <i className="ri-error-warning-fill mr-1"></i>{msg}
    </p> : null
  );

  return (
    <>
      {!isGoogleLoginLoading ?

        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#0f1113]" : "bg-slate-50"}`}>

          {registerLimiterError ? (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-3xl">
              <i className="ri-spam-3-line text-5xl text-red-500 mb-4 block"></i>
              <h1 className="text-xl font-bold text-red-600">{registerLimiterError}</h1>
            </div>
          ) : (
            <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl transition-all border ${isDarkMode ? "bg-[#161b22] border-white/5 shadow-black/50" : "bg-white border-gray-100 shadow-blue-500/5"}`}>

              {/* Header */}
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
                  Join Basta Storage
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Start your secure cloud journey</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name Input */}
                <div>
                  <div className="relative">
                    <i className="ri-user-3-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={registerData.name}
                      onChange={handleChange}
                      required
                      disabled={otpSent} // Disable if OTP is sent
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:ring-2 outline-none ${isDarkMode ? "bg-gray-800/50 border-white/10 text-white focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 focus:ring-blue-500/20"}`}
                    />
                  </div>
                  <ErrorMsg className="bg-amber-300" msg={errorRegister?.name?.[0] ? errorRegister.name[0] : otpError?.name?.[0] ? otpError.name[0] : null} />
                </div>

                {/* Email Input */}
                <div>
                  <div className="relative">
                    <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={registerData.email}
                      onChange={handleChange}
                      required
                      disabled={otpSent} // Disable if OTP is sent
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:ring-2 outline-none ${isDarkMode ? "bg-gray-800/50 border-white/10 text-white focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 focus:ring-blue-500/20"}`}
                    />
                  </div>
                  <ErrorMsg msg={otpError?.email?.[0] || otpError?.error || errorRegister?.email?.[0] || (errorRegister.error ? errorRegister.error : null)} />
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative group">
                    <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>

                    <input
                      type={showPassword ? "text" : "password"} // Dynamic Type
                      name="password"
                      placeholder="Create Password"
                      value={registerData.password}
                      disabled={otpSent} // Disable if OTP is sent
                      onChange={handleChange}
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border transition-all focus:ring-2 outline-none ${isDarkMode
                        ? "bg-gray-800/50 border-white/10 text-white focus:ring-blue-500/50"
                        : "bg-gray-50 border-gray-200 focus:ring-blue-500/20"
                        }`}
                    />

                    {/* Eye Button */}
                    <button
                      type="button" // Form submit hone se rokne ke liye
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1"
                    >
                      <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                    </button>
                  </div>

                  <ErrorMsg msg={errorRegister?.password?.[0] ? errorRegister.password[0] : otpError?.password?.[0]} />
                </div>

                {!isVerifyOtpWrong && (
                  <button
                    type="submit"
                    disabled={isClickOnRegisterButton}
                    className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    {isClickOnRegisterButton ? "Creating Account..." : "Create Account"}
                  </button>
                )}
              </form>

              {/* OTP Section Wrapper */}
              <div className="mt-4">
                <OTP email={registerData.email} name={registerData.name} password={registerData.password} />
              </div>

              <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
                  Login
                </Link>
              </p>

              {/* Separator */}
              <div className="flex items-center my-8">
                <div className={`flex-grow border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}></div>
                <span className="mx-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Secure Login</span>
                <div className={`flex-grow border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}></div>
              </div>

              {/* Social Logins */}
              <div className="flex justify-center items-center gap-4 mb-8 ">
                <div className=""><LoginWithGoogle /></div>
                {"|"}
                <div className=""><LoginWithGithub /></div>
              </div>

              <TermsPrivacyFooter />
            </div>
          )}
        </div>

        :

        /* --- NEW ANIMATED LOADING UI --- */
        <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 ${isDarkMode ? "bg-[#0f1113]" : "bg-white"}`}>
          <div className="relative flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>

            {/* Inner Static Logo */}
            <div className="absolute flex items-center justify-center">
              <img
                src={isDarkMode ? "/basta logo.png" : "/bst logo.png"}
                className="w-10 h-10 animate-pulse bg-black p-1 rounded-lg"
                alt="loading"
              />
            </div>
          </div>
        </div>
      }

    </>
  );

}

export default Register;