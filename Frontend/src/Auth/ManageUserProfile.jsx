import React, { useContext, useEffect, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function ManageUserProfile() {
    const {
        isDarkMode,
        setIsManageProfileShowing,
        storeUserData,
        updateUserData,
        userUpdateMessage,
        isUpdatedUserData,
        getUserProfile
    } = useContext(BastaStorageContext);

    const [isInputTagActive, setIsInputTagActive] = useState(false);

    const [formData, setFormData] = useState({
        photo: {},
        name: storeUserData.name,
        email: storeUserData.email // Added for consistency
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserData(formData);
    }

    useEffect(() => {
        if (isUpdatedUserData) getUserProfile();
    }, [isUpdatedUserData, getUserProfile]);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-[2px] z-[1000] p-4">
            {/* Main Modal Card */}
            <div className={`w-full max-w-[450px] rounded-xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-300 transition-all ${isDarkMode ? "bg-[#1c1f23] text-white border border-white/10" : "bg-white text-gray-800"
                }`}>

                {/* Close Button */}
                <button
                    onClick={() => setIsManageProfileShowing(false)}
                    className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-500"
                        }`}
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group mb-4">
                        <div className={`w-28 h-28 rounded-full p-1 border-2 border-dashed transition-colors ${isDarkMode ? "border-blue-500/50" : "border-blue-400"
                            }`}>
                            <div className="w-full h-full rounded-full overflow-hidden shadow-xl">
                                <img

                                    src={storeUserData.picture ? storeUserData.picture : "/user-img.png"}
                                    alt="profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Camera Overlay */}
                        <label className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-90 border-4 border-white dark:border-[#1c1f23]">
                            <i className="ri-camera-lens-line text-lg"></i>
                            <input
                                type="file"
                                name="userProfile"
                                onChange={(e) => {
                                    handlePhotoChange(e)
                                    setIsInputTagActive(true)

                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight">Edit Profile</h2>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mt-1 text-center">
                        Personalize your account details
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={(e) => {
                    handleSubmit(e)
                    setIsInputTagActive(false)
                }} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className={`text-[11px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => {
                                handleChange(e)
                                setIsInputTagActive(true)
                            }}
                            className={`w-full rounded-[1.2rem] px-5 py-3.5 outline-none transition-all border ${isDarkMode
                                ? "bg-black/20 border-white/5 focus:border-blue-500/50 text-white"
                                : "bg-gray-50 border-gray-100 focus:border-blue-400 text-gray-800"
                                }`}
                            placeholder="Your Name"
                        />
                    </div>

                    {/* Email Field (Disabled) */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40">
                            Email Address
                        </label>
                        <div className={`w-full rounded-[1.2rem] px-5 py-3.5 border flex items-center gap-3  ${isDarkMode ? "bg-white/5 border-transparent text-gray-500" : "bg-gray-100 border-transparent text-gray-400"
                            }`}>
                            <i className="ri-mail-lock-line opacity-50"></i>
                            <span className="text-sm font-medium">{formData.email}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsManageProfileShowing(false)}
                            className={`flex-1 py-4 rounded-[1.3rem] text-xs font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 border ${isDarkMode
                                ? "border-white/10 text-white hover:bg-white/5"
                                : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isInputTagActive}
                            className={`
                            flex-1 py-4 rounded-[1.3rem]
                            text-xs font-black uppercase tracking-widest
                            text-white shadow-lg transition-all active:scale-95

                            ${isInputTagActive
                                    ? "bg-blue-500 hover:bg-blue-600 cursor-pointer shadow-blue-500/20"
                                    : "bg-gray-400 opacity-50 cursor-not-allowed"}
                        `}
                        >
                            Save Changes
                        </button>

                    </div>
                </form>
            </div >

            {/* Notification Toast */}
            {
                (userUpdateMessage.success || userUpdateMessage.error) && (
                    <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${userUpdateMessage.success ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}>
                        <i className={userUpdateMessage.success ? "ri-checkbox-circle-fill text-xl" : "ri-error-warning-fill text-xl"}></i>
                        <span className="text-[11px] font-black uppercase tracking-widest">
                            {userUpdateMessage.success || userUpdateMessage.error}
                        </span>
                    </div>
                )
            }
        </div >
    );
}

export default ManageUserProfile;