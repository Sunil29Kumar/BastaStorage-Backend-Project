import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BastaStorageContext } from '../hooks/Context/ContextAPI';

function Breadcrumb({ currentComp }) {
    const { currentDirPath, isDarkMode } = useContext(BastaStorageContext);
    const currentLocation = useLocation();

    return (
        <nav className="flex items-center  py-2   select-none">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md transition-all ${isDarkMode
                ? "bg-white/5 border border-white/5 shadow-2xl shadow-black/20"
                : "bg-slate-100/50 border border-slate-200/50 shadow-sm"
                }`}>

                {/* Home/Root Icon */}
                <Link
                    to="/my-files"
                    className={`flex items-center gap-2 group transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-blue-600"
                        }`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? "bg-white/5 group-hover:bg-blue-500/20" : "bg-white group-hover:bg-blue-50 group-hover:shadow-sm"
                        }`}>
                        <i className="ri-home-4-fill text-lg"></i>
                    </div>
                    <span className="text-sm font-black tracking-tight uppercase px-1">{currentComp || "Storage"}</span>
                </Link>

                {/* Path Segments */}
                {currentDirPath.map((path, index) => (
                    <div key={index} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                        {/* Separator Icon */}
                        <i className={`ri-arrow-right-s-line text-lg opacity-30 ${isDarkMode ? "text-white" : "text-slate-900"}`}></i>

                        <Link
                            to={`/directory/${path.dirPathId}`}
                            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border ${index === currentDirPath.length - 1
                                ? isDarkMode
                                    ? "bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                    : "bg-blue-50 border-blue-100 text-blue-600 shadow-sm"
                                : isDarkMode
                                    ? "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                                    : "border-transparent text-slate-500 hover:bg-white hover:text-blue-600"
                                }`}
                        >
                            {path.dirName}
                        </Link>
                    </div>
                ))}

                {/* Trailing Separator (Optional: shows you are inside the last folder) */}
                {currentDirPath.length > 0 && (
                    <div className="flex items-center gap-2 opacity-20">
                        <i className={`ri-arrow-right-s-line text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}></i>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Breadcrumb;