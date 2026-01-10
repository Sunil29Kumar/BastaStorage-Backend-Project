import React, { useContext } from 'react';
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { FiImage, FiVideo, FiFileText, FiMoreHorizontal, FiHardDrive, FiArrowUpRight } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { formatBytes } from './RemainingStorage';

const StorageOverview = () => {
    const { isDarkMode, storageData, allFileDirectoriesList, BASE_URL, currentSubscription, storeUserData } = useContext(BastaStorageContext);


    // --- REAL DATA CALCULATIONS ---
    const totalSpace = storageData.totalSpace || 1; // Avoid division by zero
    const usedSpace = storageData.usedSpace || 0;
    const usagePercent = (usedSpace / totalSpace) * 100;



    // Categorizing real file sizes
    const getStats = (typePrefix) => {
        return allFileDirectoriesList.files?.filter(file => typePrefix === 'others'
            ? !['image/', 'video/', 'application/'].some((p) => file.type.startsWith(p))
            : file.type.startsWith(typePrefix))
            .reduce((acc, file) => acc + (file.size || 0), 0);
    };


    const stats = [
        { type: "Images", size: getStats('image/'), color: "bg-blue-500", icon: <FiImage /> },
        { type: "Videos", size: getStats('video/'), color: "bg-red-500", icon: <FiVideo /> },
        { type: "Documents", size: getStats('application/'), color: "bg-amber-500", icon: <FiFileText /> },
        { type: "Others", size: getStats('others'), color: "bg-slate-400", icon: <FiMoreHorizontal /> },
    ];

    // Get last 3 uploaded files for "Recent Activity"
    const recentUploads = [...allFileDirectoriesList.files].reverse().slice(0, 3);

    return (
        <div className={`w-full overflow-auto no-scrollbar  mx-auto rounded-xl px-2 pt-5 pb-1  shadow-2xl transition-all duration-500  ${isDarkMode ? " border-white/5 text-white shadow-black/50" : "bg-gray-200  text-gray-800 shadow-gray-200/50"
            }`}>

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30">
                        <FiHardDrive />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter">Storage Overview</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Live cloud infrastructure</p>
                    </div>
                </div>
                <Link to={storeUserData?.subscriptionTier === "free" ? `/plans` : `/manage-subscription`} className="px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                    {storeUserData?.subscriptionTier === "free" ? 'Upgrade Storage' : 'Manage Plan '}
                </Link>
            </div>

            {/* --- MAIN PROGRESS SECTION --- */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-6">
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black tracking-tighter text-blue-500">{formatBytes(usedSpace)}</span>
                        <span className="text-xl font-bold opacity-30">/ {formatBytes(totalSpace)} used</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-widest ${usagePercent > 85 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-green-500/10 text-green-500'}`}>
                        {usagePercent.toFixed(1)}% CAPACITY
                    </div>
                </div>

                {/* Segmented Real-time Progress Bar */}
                <div className={`w-full h-5 flex rounded-full overflow-hidden p-1 shadow-inner ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                    {stats.map((file, i) => (
                        <div
                            key={i}
                            className={`${file.color} h-full rounded-sm transition-all duration-1000 ease-in-out`}
                            style={{
                                width: `${(file.size / totalSpace) * 100}%`,
                                minWidth: file.size > 0 ? '8px' : '0px'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* --- FILE TYPE CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {stats.map((item, i) => (
                    <div key={i} className={`group p-5 rounded-[2.5rem] border transition-all hover:-translate-y-2 cursor-pointer ${isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-gray-50 border-transparent hover:bg-white hover:shadow-2xl hover:shadow-gray-200"
                        }`}>
                        <div className={`w-12 h-12 rounded-2xl mb-5 flex items-center justify-center text-white shadow-lg ${item.color}`}>
                            {item.icon}
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{item.type}</h4>
                        <p className="text-xl font-black mb-4">{formatBytes(item.size)}</p>

                        {/* Mini Bar Chart per item */}
                        <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${(item.size / usedSpace) * 100 || 0}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- RECENT UPLOADS --- */}
            <div className={`space-y-6 rounded-b-4xl p-5  ${isDarkMode ? " bg-[#1c1f23] border-white/5 text-white shadow-black/50" : "bg-gray-200  text-gray-800 shadow-gray-200/50"}`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Recent Transactions</h3>
                    <Link to="/my-files" className="group flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                        View Database <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid gap-4">
                    {recentUploads.length > 0 ? recentUploads.map((file, i) => (
                        console.log("ovv file", file),
                        
                        <a href={`${BASE_URL}/file/${file._id}`} key={i} className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:bg-white/5" : "bg-white border-gray-100 hover:shadow-lg shadow-gray-100"
                            }`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isDarkMode ? "bg-white/5 text-blue-400" : "bg-blue-50 text-blue-500"
                                    }`}>
                                    <FiFileText />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tight mb-1 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">
                                        {file.type.split('/')[1]} • {new Date(file.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-black tracking-tight px-3 py-1 rounded-lg ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                                    {formatBytes(file.size)}
                                </span>
                            </div>
                        </a>
                    )) : (
                        <p className="text-center py-10 opacity-30 text-xs font-bold uppercase tracking-widest">No recent uploads found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StorageOverview;