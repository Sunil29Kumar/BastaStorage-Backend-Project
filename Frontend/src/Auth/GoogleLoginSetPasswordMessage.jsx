import React, { useState, useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { RiLockPasswordLine, RiCloseLine, RiShieldCheckLine, RiEyeLine, RiEyeOffLine, RiErrorWarningLine, RiCheckboxCircleLine, RiArrowLeftLine } from "react-icons/ri";

function SocialLoginSetPasswordMessage({ onClose }) {
    const {
        setGooglePassword, // Aap is function ka naam backend/context mein generic rakh sakte hain
        googlePasswordSuccessMessage,
        googlePasswordError,
        storeUserData
    } = useContext(BastaStorageContext);

    const [showForm, setShowForm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    // Dynamic Provider Name (Capitalize first letter)
    const provider = storeUserData?.loginWith 
        ? storeUserData.loginWith.charAt(0).toUpperCase() + storeUserData.loginWith.slice(1) 
        : "Social Media";

    const handleSubmit = () => {
        setGooglePassword(password, confirmPassword);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="relative w-full max-w-[420px] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Top Decorative Element */}
                <div className={`h-1.5 w-full ${showForm ? 'bg-emerald-500' : 'bg-blue-600'} transition-colors duration-500`} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                >
                    <RiCloseLine size={24} />
                </button>

                <div className="p-8 md:p-10">
                    {!showForm ? (
                        <div className="text-center">
                            {/* Icon Container */}
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                                <RiLockPasswordLine size={40} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                                Account Security
                            </h3>
                            <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                                You're currently using <span className="font-semibold text-gray-800">{provider}</span>.
                                Please set a password to access your files even without <span className="font-semibold text-blue-600">{provider}</span>.
                            </p>

                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full flex cursor-pointer items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-xl shadow-blue-100"
                            >
                                <RiShieldCheckLine size={20} />
                                Set Your Password
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right-10 duration-300">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">New Password</h3>
                            <p className="text-sm text-gray-500 mb-8">Create a secure password for your account.</p>

                            <div className="space-y-5">
                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showPass ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {googlePasswordError?.password?.[0] && (
                                    <p className="text-sm text-red-600 font-medium">{googlePasswordError.password[0]}</p>
                                )}

                                {/* Confirm Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Repeat password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                {googlePasswordError?.confirmPassword?.[0] && (
                                    <p className="text-sm text-red-600 font-medium">{googlePasswordError.confirmPassword[0]}</p>
                                )}

                                {/* Messages */}
                                {(googlePasswordError?.error || googlePasswordSuccessMessage) && (
                                    <div className={`flex items-center gap-3 p-4 rounded-2xl animate-pulse ${googlePasswordError?.error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                                        }`}>
                                        {googlePasswordError?.error ? <RiErrorWarningLine size={20} /> : <RiCheckboxCircleLine size={20} />}
                                        <p className="text-sm font-medium">{googlePasswordError?.error || googlePasswordSuccessMessage}</p>
                                    </div>
                                )}

                                <div className="pt-2 flex flex-col gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!password || password !== confirmPassword}
                                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black active:scale-[0.97] transition-all shadow-lg disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Save & Update
                                    </button>

                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex items-center justify-center gap-2 text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors py-2"
                                    >
                                        <RiArrowLeftLine size={18} />
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SocialLoginSetPasswordMessage;