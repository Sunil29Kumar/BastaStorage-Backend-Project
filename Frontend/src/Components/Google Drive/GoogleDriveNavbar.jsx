import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { Link } from 'react-router-dom';

function GoogleDriveNavbar({ activeTab, setActiveTab }) {
    const { isDarkMode, setIsGDBoxOpen } = useContext(BastaStorageContext);
    const tabs = ['All', 'Folder', 'Files'];

    return (
        <div className="space-y-6">
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 p-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform -rotate-3'>
                        <img src='/google drive.png' alt="GD" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">Google Drive</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">External Storage</p>
                    </div>
                </div>

                <Link to="/my-files" 
                    onClick={() => setIsGDBoxOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-widest transition-all ${
                        isDarkMode 
                        ? "bg-white/5 hover:bg-red-500/20 text-white border border-white/10" 
                        : "bg-white hover:bg-gray-100 text-blue-400 shadow-sm border border-gray-200"
                    }`}
                >
                    Back to My Files
                </Link>
            </div>

            {/* Segmented Control Picker */}
            <div className={`flex p-1.5 rounded-2xl ${isDarkMode ? "bg-black/40 border border-white/5" : "bg-gray-200/50 border border-gray-200"}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[10px] cursor-pointer font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                            activeTab === tab 
                            ? "bg-blue-600 text-white shadow-xl shadow-blue-500/40 transform scale-[1.02]" 
                            : `hover:opacity-100 opacity-40 ${isDarkMode ? "text-white" : "text-black"}`
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GoogleDriveNavbar;