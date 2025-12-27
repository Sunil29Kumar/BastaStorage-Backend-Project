import React, { useContext, useState } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { RiArrowRightDoubleLine } from 'react-icons/ri';

function GoogleDriveNavbar({ activeTab, setActiveTab }) {
    const { isDarkMode, setIsGDBoxOpen } = useContext(BastaStorageContext);

    const tabs = ['All', 'Folder', 'Files'];

    return (
        <div className="mb-6">
            {/* Top Bar: Logo & Close */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 p-1 bg-white rounded-xl shadow-sm overflow-hidden'>
                        <img src='/google drive.png' alt="GD" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            Google Drive
                        </h1>
                        <div className="h-1 w-8 bg-blue-500 rounded-full mt-[-2px]"></div>
                    </div>
                </div>

                <button 
                    onClick={() => setIsGDBoxOpen(false)}
                    className={`group flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-black"
                    }`}
                >
                    <RiArrowRightDoubleLine className="text-2xl group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Tab Navigation */}
            <div className={`flex items-center gap-2 p-1 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-[11px] cursor-pointer font-black uppercase tracking-widest rounded-xl transition-all ${
                            activeTab === tab 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                            : `opacity-50 hover:opacity-100 ${isDarkMode ? "text-white" : "text-black"}`
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default GoogleDriveNavbar;