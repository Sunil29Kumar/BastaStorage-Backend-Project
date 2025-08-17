import React, { useContext, useState, useEffect } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function ManageUserProfile() {
    const { setIsManageProfileShowing, storeUserData,updateUserData ,userUpdateMessage,isUpdatedUserData } = useContext(BastaStorageContext);

    const [formData, setFormData] = useState({
        photo: "",
        name: storeUserData.name,
        // email: "",
    });


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setFormData({ ...formData, photo: imgUrl });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Profile:", formData);
        updateUserData(formData)
        setTimeout(() => {
            setIsManageProfileShowing(false) 
        }, 1500);
        // yahan API call karke backend ko update kar sakte ho
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div className="w-[90%] md:w-[60%] lg:w-[40%] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 relative">
                {/* Close Button */}
                <button
                    onClick={() => setIsManageProfileShowing(false)}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                >
                    <i className="ri-close-large-line text-xl"></i>
                </button>

                {/* Profile Header */}
                <div className="flex flex-col items-center gap-3 border-b pb-5">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-blue-400">
                        <img
                            src={storeUserData.picture || "/user-img.png"}
                            alt="profile"
                            className="w-full h-full object-cover"
                        />
                        <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 px-2 rounded-full cursor-pointer shadow hover:bg-blue-600 transition">
                            <i className="ri-camera-fill text-lg"></i>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Manage Profile</h2>
                    <p className="text-sm text-gray-500">Update your personal details</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 mt-6 px-2"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email (readonly) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 text-gray-600"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsManageProfileShowing(false)}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 shadow transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            <div className= {` absolute bottom-[5%] left-[50%] transform -translate-x-1/2  ${isUpdatedUserData ? "block bg-green-400 text-black p-2 rounded-md " : "hidden"} `}>
                <h1>{userUpdateMessage} </h1>
            </div>
        </div>
    );
}

export default ManageUserProfile;
