import React, {useState} from "react";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";
import {useContext} from "react";

function OTP({email}) {
  const {
    sendOPT,
    otpSent,
    otpCountDown,
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
  } = useContext(BastaStorageContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    verifyUserOtp({email, otp});
    setIsVerifyOtpWrong(true);
  };

  return (
    <>
      {isVerifyOtpWrong && (
        <div className="max-w-md mx-auto p-3 bg-gray-200 rounded-2xl shadow-lg space-y-4 cursor-pointer">
          {!otpSent && (
            <div onClick={() => sendOPT(email)} className="flex justify-center">
              <button className="text-green-600 hover:text-green-700  transition cursor-pointer">
                Send OTP
              </button>
            </div>
          )}

          {sentOtpMessage && (
            <p className=" text-center text-blue-500 ">{sentOtpMessage}</p>
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
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="••••"
                  className="w-32 text-center border border-gray-300 rounded-lg px-3 py-2 text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {isOtpWrong && (
                <p className="text-center text-red-500 text-sm">{otpError}</p>
              )}

              {isVerifyOtpWrong && (
                <p className="text-center text-red-500 text-sm">
                  {verifyOtpMessage}
                </p>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                >
                  Verify OTP
                </button>
              </div>
              {!isVerifyOtpWrong && (
                <p className="text-center text-green-500 text-sm">
                  {verifyOtpMessage}
                </p>
              )}

              <div className="flex justify-center">
                {otpCountDown == 0 && (
                  <button
                    onClick={() => sendOPT(email)}
                    className="text-green-600 hover:text-green-700 cursor-pointer transition"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default OTP;
