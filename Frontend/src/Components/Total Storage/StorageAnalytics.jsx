import React, { useContext, useMemo } from 'react';
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import {
    FiPieChart, FiTrendingUp, FiFolder, FiActivity,
    FiAlertCircle, FiTrash2, FiZap, FiFile,
    FiHardDrive
} from "react-icons/fi";
import { formatBytes } from './RemainingStorage';

const StorageAnalytics = () => {
    const { isDarkMode, storageData, allFileDirectoriesList } = useContext(BastaStorageContext);

    const total = storageData.totalSpace || 1;
    const used = storageData.usedSpace || 0;
    const usagePercent = Math.min((used / total) * 100, 100);

    // 1. Data Processing for Analytics
    const analytics = useMemo(() => {
        const getStats = (typePrefix) => {
            const list = allFileDirectoriesList.files.filter(file =>
                typePrefix === 'others'
                    ? !['image/', 'video/', 'application/'].some(p => file.type.startsWith(p))
                    : file.type.startsWith(typePrefix)
            );
            const size = list.reduce((acc, file) => acc + (file.size || 0), 0);
            return { size, count: list.length, percent: (size / total) * 100 };
        };

        return {
            images: getStats('image/'),
            videos: getStats('video/'),
            docs: getStats('application/'),
            others: getStats('others'),
            // Find top 3 largest files
            largestFiles: [...allFileDirectoriesList.files].sort((a, b) => b.size - a.size).slice(0, 3)
        };
    }, [allFileDirectoriesList.files, total]);

    const categories = [
        { label: "Images", ...analytics.images, color: "#3b82f6" },
        { label: "Videos", ...analytics.videos, color: "#ef4444" },
        { label: "Documents", ...analytics.docs, color: "#f59e0b" },
        { label: "Others", ...analytics.others, color: "#64748b" },
    ];

    return (
        <div className="w-fullmx-auto flex flex-col gap-8 p-10 overflow-auto">


            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight ">Storage Analytics</h2>
                    <p className="text-sm opacity-50 font-medium">Real-time insights of your Basta Storage</p>
                </div>
                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                    <FiHardDrive className="text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest">{formatBytes(used)} / {formatBytes(total)}</span>
                </div>
            </div>
            {/* SECTION 1: TOP INSIGHT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Files", val: allFileDirectoriesList.files?.length, icon: <FiFile />, col: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Folders", val: allFileDirectoriesList.directories?.length, icon: <FiFolder />, col: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Health", val: usagePercent > 90 ? "Critical" : "Good", icon: <FiActivity />, col: "text-purple-500", bg: "bg-purple-500/10" },
                    { label: "Saved Space", val: formatBytes(total - used), icon: <FiZap />, col: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#1c1f23] border-white/5' : 'bg-white border-gray-100'}`}>
                        <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.col} flex items-center justify-center text-xl mb-4 shadow-sm`}>
                            {item.icon}
                        </div>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{item.label}</p>
                        <p className="text-2xl font-black tracking-tight mt-1">{item.val}</p>
                    </div>
                ))}
            </div>

            {/* SECTION 2: MAIN CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Donut Chart (LHS) */}
                <div className={`lg:col-span-4 p-10 rounded-[3rem] border flex flex-col items-center justify-center ${isDarkMode ? "bg-[#1c1f23] border-white/5" : "bg-white border-gray-100"}`}>
                    <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className={isDarkMode ? 'text-white/5' : 'text-gray-100'} />
                            <circle cx="112" cy="112" r="100" stroke="#3b82f6" strokeWidth="16" fill="transparent"
                                strokeDasharray={628} strokeDashoffset={628 - (628 * usagePercent) / 100}
                                strokeLinecap="round" className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute text-center">
                            <h4 className="text-5xl font-black tracking-tighter">{usagePercent.toFixed(0)}%</h4>
                            <p className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em]">Used Space</p>
                        </div>
                    </div>
                    <div className="w-full space-y-3">
                        <div className="flex justify-between text-xs font-bold px-2">
                            <span className="opacity-40">Free Space</span>
                            <span className="text-emerald-500">{formatBytes(total - used)}</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${100 - usagePercent}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Distribution & Large Files (RHS) */}
                <div className="lg:col-span-8 flex flex-col gap-8">

                    {/* Data Distribution */}
                    <div className={`p-8 rounded-[3rem] border ${isDarkMode ? "bg-[#1c1f23] border-white/5" : "bg-white border-gray-100"}`}>
                        <h3 className="text-lg font-black mb-6 tracking-tight flex items-center gap-2">
                            <FiPieChart className="text-blue-500" /> Data Distribution
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                            {categories.map((cat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                                        <span>{cat.label} ({cat.count})</span>
                                        <span>{formatBytes(cat.size)}</span>
                                    </div>
                                    <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <div className="h-full transition-all duration-1000" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Optimization & Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Large Files Detector */}
                        <div className={`p-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#1c1f23] border-white/5' : 'bg-white border-gray-100'}`}>
                            <h4 className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                                <FiAlertCircle /> Largest Files
                            </h4>
                            <div className="space-y-3">
                                {analytics.largestFiles.map((f, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                                        <span className="text-xs font-bold truncate max-w-[120px]">{f.name}</span>
                                        <span className="text-[10px] font-black text-red-500">{formatBytes(f.size)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Suggestion */}
                        <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20">
                            <FiZap className="text-3xl mb-4 text-amber-300" />
                            <h4 className="text-lg font-black tracking-tight leading-tight mb-2">Optimize Space</h4>
                            <p className="text-xs opacity-80 mb-4">You have 12 duplicate images and large videos taking up 40% of space.</p>
                            <button className="w-full py-3 rounded-xl bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all active:scale-95">
                                Run Cleanup
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StorageAnalytics;