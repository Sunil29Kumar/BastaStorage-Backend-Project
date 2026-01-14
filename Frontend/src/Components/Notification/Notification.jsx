import React, { useContext, useRef, useEffect, useState } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { FaBell, FaCheckDouble, FaCircle, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Notification() {
    const { notificationsData, isDarkMode, setIsClickOnNotificationBell, markNotificationAsRead, markAllNotificationsAsRead } = useContext(BastaStorageContext);
    const [isSeeAllActive, setIsSeeAllActive] = useState(false);
    const dropdownRef = useRef(null);

    console.log(notificationsData);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsClickOnNotificationBell(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsClickOnNotificationBell]);

    // Theme Variables for cleaner code
    const theme = {
        panel: isDarkMode ? "bg-slate-900/95 border-slate-700 backdrop-blur-xl" : "bg-white border-slate-100",
        header: isDarkMode ? "border-slate-800" : "border-slate-50",
        title: isDarkMode ? "text-white" : "text-slate-800",
        message: isDarkMode ? "text-slate-400" : "text-slate-500",
        itemHover: isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-blue-50/40",
        iconBg: isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
    };



    return (
        <div
            ref={dropdownRef}
            className={`absolute top-16 right-0 sm:right-10 w-[calc(100vw-2rem)] sm:w-96 ${theme.panel} border rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300`}
        >
            {/* Header */}
            <div className={`p-6 border-b ${theme.header} flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600/10 p-2.5 rounded-xl text-blue-600">
                        <FaBell className="animate-swing" />
                    </div>
                    <h2 className={`font-black tracking-tight text-lg ${theme.title}`}>Notifications</h2>
                </div>
                {notificationsData?.length > 0 && notificationsData.filter((notify) => !notify.read).length > 0 && (
                    <button
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-[10px] cursor-pointer font-black uppercase text-blue-500 tracking-widest hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-all flex items-center gap-1.5">
                        <FaCheckDouble size={12} /> {"Mark read all"}
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className={`max-h-[400px] overflow-y-auto no-scrollbar ${isDarkMode ? "bg-slate-900/50" : "bg-slate-50/30"}`}>
                {notificationsData && notificationsData.length > 0 ? (
                    <div className={`divide-y ${theme.header}`}>
                        {notificationsData.slice(0, isSeeAllActive ? notificationsData.length : 2).map((notification, index) => {

                            const date = new Date(notification.createdAt);

                            const year = date.getUTCFullYear();
                            const month = date.toLocaleString('en-US', { month: 'short' });
                            const day = date.getUTCDate();
                            const hour = date.getHours();
                            const minute = date.getMinutes();
                            const finalFormat = `${year} ${month} ${day}  at ${hour}:${minute}`;
                            return <div
                                onClick={() => markNotificationAsRead(notification._id)}

                                key={index}
                                className={`p-5 ${theme.itemHover} transition-all cursor-pointer group relative flex gap-4`}
                            >
                                {/* Active Indicator */}
                                {!notification.read && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <FaCircle className="text-blue-500 text-[6px] animate-pulse" />
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-400 group-hover:scale-105 transition-all`}>
                                    <FaInfoCircle className={`${isDarkMode ? "text-slate-500" : "text-slate-400"} group-hover:text-blue-500 transition-colors`} size={20} />
                                </div>

                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className={`text-sm font-black leading-tight truncate ${theme.title}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[9px] font-bold text-slate-400  tracking-tighter pt-0.5">
                                            {finalFormat || "Just now"}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed ${theme.message} line-clamp-2`}>
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        })}
                    </div>
                ) : (
                    <div className="p-16 text-center flex flex-col items-center justify-center space-y-4">
                        <div className={`w-20 h-20 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} rounded-full flex items-center justify-center text-slate-300`}>
                            <FaBell size={32} />
                        </div>
                        <div>
                            <p className={`font-black ${theme.title}`}>All caught up!</p>
                            <p className={`text-xs font-bold ${theme.message}`}>No new updates for you.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Toggle */}
            <button
                onClick={() => setIsSeeAllActive(!isSeeAllActive)}
                className={`w-full p-5 cursor-pointer ${isDarkMode ? "bg-slate-800/50 border-slate-700 text-slate-300" : "bg-white border-slate-50 text-slate-400"} border-t text-center text-[10px] font-black uppercase tracking-[0.25em] hover:text-blue-500 transition-all flex items-center justify-center gap-2`}
            >
                {isSeeAllActive ? (
                    <>Show Less <FaChevronUp /></>
                ) : (
                    <>See All Activity <FaChevronDown /></>
                )}
            </button>
        </div>
    );
}

export default Notification;