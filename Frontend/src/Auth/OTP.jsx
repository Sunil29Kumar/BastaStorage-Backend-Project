import React, { useEffect, useState, useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function OTP({ email, name, password }) {
  const {
    sendOPT,
    otpSent,
    otpError,
    isOtpWrong,
    verifyUserOtp,
    sentOtpMessage,
    setVerifyOtpMessage,
    verifyOtpMessage,
    isVerifyOtpWrong,
    setIsVerifyOtpWrong,
    otp,
    setOtp,
    setOtpCountDown,
    otpCountDown,
    otpLimiterError
  } = useContext(BastaStorageContext);

  // const [otpCountDown, setOtpCountDown] = useState(0);

  // Start 60s countdown whenever OTP is sent
  useEffect(() => {
    if (!otpSent || otpCountDown <= 0) return;

    const timer = setInterval(() => {
      setOtpCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, otpCountDown]);

  const handleSendOtp = () => {
    sendOPT({ email, name, password });
    setOtpCountDown(60); // reset countdown to 60s
  };

  // verify otp 
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyUserOtp({ email, otp });
    setIsVerifyOtpWrong(true);
  };

  const percentage = (otpCountDown / 60) * 100;

  return (
    <>
      {/* OPT limiter error  */}
      {otpLimiterError && (
        <p className="text-red-500 text-sm">{otpLimiterError}</p>
      )}

      {isVerifyOtpWrong && (
        <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-2xl shadow-md space-y-4 ">
          {/* <div className={`max-w-md mx-auto p-4  rounded-2xl shadow-md space-y-4 ${name.length > 0 && email.length > 0 && password.length > 0 ? "bg-green-300" : "bg-gray-100"}`}> */}
          {!otpSent && (
            <div className="flex justify-center">
              <button
                onClick={handleSendOtp}
                className="transition font-medium cursor-pointer "
              >
                Send OTP
              </button>
            </div>
          )}

          {sentOtpMessage && (
            <p className="text-center text-blue-500">{sentOtpMessage}</p>
          )}

          {otpSent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center gap-2 items-center">
                <label htmlFor="otp" className="text-gray-700">
                  Enter OTP:
                </label>
                <input
                  id="otp"
                  type="text"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  placeholder="••••"
                  // pattern="\d{4}"
                  maxLength={4}
                  className="w-32 text-center border border-gray-300 rounded-lg px-3 py-2 text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>


              {otpError?.error && (
                <p className="text-center text-red-500 text-xs italic">
                  {otpError.error}
                </p>
              )}



              {isVerifyOtpWrong && (
                <p className="text-center text-red-500 text-sm">
                  {verifyOtpMessage}
                </p>
              )}

              {!isVerifyOtpWrong && (
                <p className="text-center text-green-500 text-sm">
                  {verifyOtpMessage}
                </p>
              )}


              <div className="flex justify-center ">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition cursor-pointer "
                >
                  Verify OTP
                </button>
              </div>

              {/* Countdown Ring and Resend OTP */}
              <div className="flex items-center justify-center gap-2">
                {otpCountDown > 0 && (

                  <div className="relative w-[3vh] h-[3vh] ">
                    <div
                      className="absolute inset-0 rounded-full transition-all flex items-center justify-center "
                      style={{
                        background: `conic-gradient(#22c55e ${percentage}%, #d1d5db ${percentage}% 100%)`,
                      }}
                    >
                    </div>
                  </div>
                )}



                {/* resend otp  */}
                <button
                  onClick={handleSendOtp}
                  disabled={otpCountDown > 0}
                  className={` rounded-lg font-medium transition text-[1vw] ${otpCountDown > 0
                    ? " text-black cursor-not-allowed"
                    : " hover:text-green-700 text-black cursor-pointer"
                    }`}
                >
                  Resend OTP
                </button>

              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default OTP;
