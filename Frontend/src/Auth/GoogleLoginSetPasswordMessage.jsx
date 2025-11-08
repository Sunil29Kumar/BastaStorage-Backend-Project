import React, { useState, useContext, useEffect } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function GoogleLoginSetPasswordMessage() {
    const {
        setGooglePassword,
        googlePasswordSuccessMessage,
        googlePasswordError,
    } = useContext(BastaStorageContext);

    const [showForm, setShowForm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    return (
        <div className=" w-full h-full fixed top-0 left-0 bg-black/30  flex items-center justify-center z-50">

        <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center animate-fadeIn">
            {/* Close Icon */}
            {/* <button
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
            >
                <i className="ri-close-line text-2xl"></i>
            </button> */}

            {!showForm ? (
                <div>
                    {/* Lock Icon */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-2xl">
                            🔒
                        </div>
                    </div>

                    <h3 className="font-bold text-2xl text-gray-900 mb-2">
                        Set Your Password
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        You signed in with <span className="font-medium">Google</span>.
                        Create a password so you can also log in using your email directly.
                    </p>

                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Set Password
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-5">
                        Create a New Password
                    </h3>

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=" text-black w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    {/* Confirm Password Input */}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className=" text-black w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    {/* Save Button */}
                    <button
                        onClick={() => {
                            setGooglePassword(password, confirmPassword);
                        }
                        }
                        className="w-full bg-green-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Save Password
                    </button>

                    {/* Messages */}
                    <div className="mt-3">
                        {googlePasswordError && (
                            <p className="text-red-500 text-sm">{googlePasswordError}</p>
                        )}
                        {googlePasswordSuccessMessage && (
                            <p className="text-green-600 text-sm">
                                {googlePasswordSuccessMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
        </div>

    );
}

export default GoogleLoginSetPasswordMessage;
