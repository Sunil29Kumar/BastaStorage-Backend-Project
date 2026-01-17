import { Link } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { useContext } from "react";

function UpgradePlanCard() {
    const { isNavMinimized, isDarkMode, storeUserData } = useContext(BastaStorageContext);

    return (
        <Link
            to={`${storeUserData?.userIs === "pro" ? "/manage-subscription" : "/plans"}`}
            className={`
                relative flex items-center transition-all duration-500 group w-full sm:w-auto
                ${!isNavMinimized
                    ? "gap-4 p-4 rounded-[1.5rem] sm:rounded-[2rem] mx-0 sm:mx-2 mb-4"
                    : "w-12 h-12 rounded-2xl mx-auto mb-6 justify-center"
                }
                /* Theme logic */
                ${isDarkMode
                    ? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/5"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50"
                }
                hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1
            `}
        >
            {/* Background Glow Effect */}
            {isDarkMode && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            )}

            {/* Icon Section */}
            <div className={`
                shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500
                ${!isNavMinimized ? "w-10 h-10 sm:w-12 sm:h-12" : "w-10 h-10"} 
                bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30
                group-hover:scale-110
            `}>
                <i className={`ri-vip-crown-2-line ${!isNavMinimized ? "text-lg sm:text-xl" : "text-lg"} text-white`}></i>
            </div>

            {/* Content Section */}
            {!isNavMinimized && (
                <div className="flex-1 min-w-0">
                    {storeUserData?.userIs !== "pro" ? (
                        <>
                            <div className="flex items-center gap-2">
                                <h3 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                                    Upgrade Plan
                                </h3>
                            </div>
                            {/* Hide subtitle on small mobile to save space */}
                            <p className={`text-[11px] sm:text-xs font-bold truncate mt-0.5 hidden xs:block ${isDarkMode ? "text-white/80" : "text-gray-800"}`}>
                                Get <span className="italic">Unlimited</span> Space
                            </p>

                            <div className="flex items-center gap-1 mt-1 sm:mt-2 text-[10px] font-black uppercase tracking-tighter text-blue-500 opacity-80 group-hover:opacity-100">
                                Explore PRO
                                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h1 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                                Manage Plan
                            </h1>
                        </div>
                    )}
                </div>
            )}

            {/* Notification Dot */}
            {/* {isNavMinimized && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></div>
            )} */}
        </Link>
    );
}

export default UpgradePlanCard;