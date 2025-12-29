import React, { useContext, useState } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import {
    RiUserLine, RiLockPasswordLine, RiPaletteLine,
    RiHardDrive2Line, RiNotification3Line, RiLogoutCircleRLine
} from 'react-icons/ri';

const Settings = () => {
    const { isDarkMode, toggleDarkMode, storeUserData, setShowLogOutBox } = useContext(BastaStorageContext);
    const [activeTab, setActiveTab] = useState('profile');

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: <RiUserLine /> },
        { id: 'appearance', label: 'Appearance', icon: <RiPaletteLine /> },
        { id: 'storage', label: 'Plan & Storage', icon: <RiHardDrive2Line /> },
        { id: 'security', label: 'Security', icon: <RiLockPasswordLine /> },
        { id: 'notifications', label: 'Notifications', icon: <RiNotification3Line /> },
    ];

    return (
        <div className={`p-6 md:p-10 w-full overflow-auto max-w-[1400px] mx-auto ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <h1 className="text-3xl font-black italic tracking-tight mb-8">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT SIDEBAR MENU */}
                <div className="lg:col-span-3 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                : `hover:bg-gray-500/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                    <hr className="my-4 opacity-10" />
                    <button
                        onClick={() => setShowLogOutBox(true)}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-500/10 transition-all">
                        <RiLogoutCircleRLine className="text-xl" /> Logout
                    </button>
                </div>

                {/* RIGHT CONTENT AREA */}
                <div className={`lg:col-span-9 p-8 md:p-12 rounded-[3rem] border shadow-sm ${isDarkMode ? 'bg-[#1c1f23] border-white/5' : 'bg-white border-gray-100'
                    }`}>
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-black mb-2">Public Profile</h2>
                                <p className="text-sm opacity-50 font-medium">Manage your personal information.</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <img
                                    src={storeUserData?.picture || "/user-img.png"}
                                    className="w-24 h-24 rounded-[2rem] border-4 border-blue-500/20 object-cover"
                                    alt="profile"
                                />
                                <button className="px-6 py-2 rounded-xl border border-blue-500 text-blue-500 text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                                    Change Avatar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</label>
                                    <input type="text" defaultValue={storeUserData?.name} className={`w-full p-4 rounded-2xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Address</label>
                                    <input type="email" defaultValue={storeUserData?.email} className={`w-full p-4 rounded-2xl border ${isDarkMode ? 'bg-black/20 border-white/10 opacity-50' : 'bg-gray-50 border-gray-200 opacity-50'} cursor-not-allowed`} disabled />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-black mb-2">Theme Preferences</h2>
                                <p className="text-sm opacity-50 font-medium">Choose how Basta looks for you.</p>
                            </div>

                            <div className="flex gap-6">
                                <button
                                    onClick={() => !isDarkMode && toggleDarkMode()}
                                    className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all ${isDarkMode ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-gray-100'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-900 mb-4 shadow-lg" />
                                    <span className="font-black text-sm uppercase tracking-widest">Dark Mode</span>
                                </button>
                                <button
                                    onClick={() => isDarkMode && toggleDarkMode()}
                                    className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all ${!isDarkMode ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-gray-800'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white mb-4 shadow-lg" />
                                    <span className="font-black text-sm uppercase tracking-widest">Light Mode</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {activeTab !== 'profile' && activeTab !== 'appearance' && (
                        <div className="h-64 flex flex-col items-center justify-center opacity-30 italic">
                            <RiHardDrive2Line size={48} className="mb-4" />
                            <p>Section coming soon in next update...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;