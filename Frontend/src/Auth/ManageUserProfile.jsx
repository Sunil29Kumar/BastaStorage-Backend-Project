import React, { useContext, useState, useEffect } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function ManageUserProfile() {
    const { isDarkMode, setIsManageProfileShowing, storeUserData, updateUserData, userUpdateMessage, isUpdatedUserData, fetchUserData } = useContext(BastaStorageContext);

    const [formData, setFormData] = useState({
        photo: {},
        name: storeUserData.name,
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

    return (
        <div className={`fixed inset-0 flex justify-center items-center bg-black/40 z-50  `}>
            <div className={`w-[40%]   backdrop-blur-md rounded-2xl shadow-2xl p-6 relative ${isDarkMode ? "bg-gray-800 text-white " : "bg-white/90 text-black"}`}>
                {/* Close Button */}
                <button
                    onClick={() => setIsManageProfileShowing(false)}
                    className={`absolute top-3 right-4 text-gray-600 hover:text-red-500 ${isDarkMode ? "text-white" : "text-black"} `}
                >
                    <i className="ri-close-large-line text-xl cursor-pointer  "></i>
                </button>

                {/* Profile Header */}
                <div className={`flex flex-col items-center gap-3 border-b pb-5 ${isDarkMode ? "border-gray-100" : "border-gray-800"}`}>
                    <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg ">
                        <img
                            src={storeUserData.picture ? storeUserData.picture : "/user-img.png"}
                            alt="profile"
                            className="w-full h-full object-cover"
                        />
                        <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 px-2 rounded-full cursor-pointer shadow hover:bg-blue-600 transition">
                            <i className="ri-camera-fill text-lg"></i>
                            <input
                                type="file"
                                // accept="image/*"
                                name="userPhoto"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Manage Profile</h2>
                    <p className={`text-sm ${isDarkMode ? "text-white" : "text-gray-500"}`}>Update your personal details</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className={`flex flex-col gap-5 mt-6 rounded-md p-3`}
                >
                    {/* Name */}
                    <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-100" : "text-gray-600"} mb-1`}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email (readonly) */}
                    <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-100" : "text-gray-600"} mb-1`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className={`w-full border border-gray-200 rounded-lg px-4 py-2 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-600"}`}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsManageProfileShowing(false)}
                            className={`px-5 py-2 rounded-lg border cursor-pointer border-gray-300  transition ${isDarkMode ? "bg-gray-800 text-white hover:bg-black " : "bg-white text-black "}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-600 shadow transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            {isUpdatedUserData ?
                <div className={`absolute top-[1%] left-[50%] transform -translate-x-1/2 block text-black py-2 px-3 rounded-md ${userUpdateMessage.success ? "bg-green-400" : ""} `}>
                    <h1>{userUpdateMessage.success} </h1>
                </div>
                : <div className={`absolute top-[1%] left-[50%] transform -translate-x-1/2 block text-black py-2 px-3 rounded-md  ${userUpdateMessage.error ? "bg-red-400" : ""}`}>
                    <h1>{userUpdateMessage.error} </h1>
                </div>}
        </div>
    );
}

export default ManageUserProfile;
