import { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { formatSize } from "../../Utils/formatSize";
import { fileFormats } from "../../Utils/FileTypes.jsx";

function MyFilesPreview() {
    const { filesList, BASE_URL, isDarkMode, currentQuickAccessFile, windowWidth } = useContext(BastaStorageContext);

    const getExtension = (filename) => filename.split(".").pop().toLowerCase();

    const getFileFormatData = (filename) => {
        const ext = getExtension(filename);
        const format = fileFormats.find(f => f.extensions.includes(ext));
        return format || fileFormats.find(f => f.type === "Unknown");
    };

    const isImageFile = (filename) => {
        return ["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(getExtension(filename));
    };

    // Responsive Height calculation
    const containerHeight = useMemo(() => {
        if (windowWidth <= 480) return "h-[60vh]"; // Mobile
        if (windowWidth <= 1024) return "h-[50vh]"; // Tablet/Small Laptop
        return "h-[45vh]"; // Desktop
    }, [windowWidth]);

    return (
        <div className={`rounded-[2rem] ${containerHeight} py-1 overflow-hidden transition-all duration-500 
            ${isDarkMode ? "bg-[#111315] border border-white/5" : "bg-white shadow-sm border border-gray-100"}`}>

            {/* HEADER */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4">
                <div>
                    <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>My Files</h2>
                    <p className="hidden sm:block text-[10px] uppercase tracking-[0.25em] font-bold opacity-30 mt-1">Quick access to your cloud</p>
                </div>
                <Link
                    to="/my-files"
                    className="px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                    See all
                </Link>
            </div>

            {/* GRID CONTAINER */}
            {/* Height set to fill remaining space minus header */}
            <div className="h-full overflow-y-auto no-scrollbar px-4 sm:px-6 pb-20 
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent 
                [&::-webkit-scrollbar-thumb]:bg-blue-400
                [&::-webkit-scrollbar-thumb]:rounded-full">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {
                        (currentQuickAccessFile.length > 0 
                            ? filesList.filter(file => file.status !== "initiated" && file.status !== "uploading" && currentQuickAccessFile.includes(`.${getExtension(file.name)}`))
                            : filesList.filter(file => file.status !== "initiated" && file.status !== "uploading")
                        ).map((file) => {
                            const format = getFileFormatData(file.name);
                            const isImg = isImageFile(file.name);
                            return (
                                <a
                                    key={file.id}
                                    href={`${BASE_URL}/file/${file.id}`}
                                    className={`group relative flex flex-col p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-500 ${isDarkMode
                                        ? "bg-[#1c1f23] border-white/5 hover:border-blue-500/50 hover:bg-[#23272b] shadow-2xl shadow-black/20"
                                        : "bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-200"
                                    }`}
                                >
                                    {/* PREVIEW BOX */}
                                    <div className="aspect-square w-full rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-[#0d0f10] flex items-center justify-center mb-3 sm:mb-4 relative">
                                        {isImg ? (
                                            <img
                                                src={`${BASE_URL}/file/${file.id}`}
                                                alt={file.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105 ${format.bg} ${format.color}`}>
                                                <span className="text-4xl sm:text-6xl drop-shadow-md">{format.icon}</span>
                                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest mt-2 opacity-60">{format.type}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* FILE INFO */}
                                    <div className="px-1">
                                        <h3 className={`text-[11px] sm:text-[13px] font-bold truncate tracking-tight mb-1 ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>
                                            {file.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-md ${isDarkMode ? "bg-white/5 text-gray-500" : "bg-slate-100 text-slate-400"}`}>
                                                {formatSize(file.size)}
                                            </span>
                                            {file.timeStamp?.fileCreatedAt && (
                                                <span className="hidden xs:block text-[8px] sm:text-[9px] font-bold opacity-30 uppercase tracking-tighter">
                                                    {file.timeStamp.fileCreatedAt.split("T")[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* ACTION ICON - Hidden on Mobile for cleaner UI */}
                                    <div className="hidden sm:flex absolute top-5 right-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40">
                                            <i className="ri-arrow-right-up-line text-xs"></i>
                                        </div>
                                    </div>
                                </a>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default MyFilesPreview;