import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { formatSize } from "../../Utils/formatSize";
import { fileFormats } from "../../Utils/FileTypes.jsx";

function MyFilesPreview() {
    const { filesList, BASE_URL, isDarkMode, currentQuickAccessFile } = useContext(BastaStorageContext);

    const getExtension = (filename) => filename.split(".").pop().toLowerCase();

    const getFileFormatData = (filename) => {
        const ext = getExtension(filename);
        const format = fileFormats.find(f => f.extensions.includes(ext));
        return format || fileFormats.find(f => f.type === "Unknown");
    };

    const isImageFile = (filename) => {
        return ["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(getExtension(filename));
    };

    useEffect(() => {
        // You can add any side effects here based on currentQuickAccessFile change
        console.log("Current Quick Access File Category:", currentQuickAccessFile);
    }, [currentQuickAccessFile]);

    return (
        <div className={`rounded-[2rem] h-[48vh] overflow-hidden  transition-all duration-500 ${isDarkMode ? "bg-[#111315] border border-white/5" : "bg-white shadow-sm border border-gray-100"}`}>

            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3">
                <div>
                    <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>My Files</h2>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-30 mt-1">Quick access to your cloud</p>
                </div>
                <Link
                    to="/my-files"
                    className="px-6 py-2.5 rounded-2xl bg-blue-500/10 text-blue-500 text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                    See all
                </Link>
            </div>

            {/* GRID CONTAINER */}
            <div className="max-h-[45vh] overflow-x-auto px-5 pb-10 custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                    {
                        currentQuickAccessFile.length > 0 ?

                            filesList.filter(file => currentQuickAccessFile.includes(`.${getExtension(file.name)}`)).map((file) => {
                                const format = getFileFormatData(file.name);
                                const isImg = isImageFile(file.name);
                                return (
                                    <a
                                        key={file.id}

                                        href={`${BASE_URL}/file/${file.id}`}
                                        className={`group relative flex flex-col p-4 rounded-[2rem] border transition-all duration-500 ${isDarkMode
                                            ? "bg-[#1c1f23] border-white/5 hover:border-blue-500/50 hover:bg-[#23272b] shadow-2xl shadow-black/20"
                                            : "bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-200"
                                            }`}
                                    >
                                        {/* PREVIEW BOX */}
                                        <div className="aspect-square w-full rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-[#0d0f10] flex items-center justify-center mb-4 relative">
                                            {isImg ? (
                                                <img
                                                    src={`${BASE_URL}/file/${file.id}`}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className={`w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110 ${format.bg} ${format.color}`}>
                                                    <span className="text-6xl drop-shadow-md">{format.icon}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-60">{format.type}</span>
                                                </div>
                                            )}
                                            {/* Glass Overlay on Hover */}
                                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        {/* FILE INFO */}
                                        <div className="px-1">
                                            <h3 className={`text-[13px] font-bold truncate tracking-tight mb-1 ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>
                                                {file.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${isDarkMode ? "bg-white/5 text-gray-500" : "bg-slate-100 text-slate-400"}`}>{formatSize(file.size)}</span>
                                            </div>
                                        </div>

                                        {/* FLOATING ACTION ICON */}
                                        <div className="absolute top-6 right-6 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/40">
                                                <i className="ri-arrow-right-up-line text-sm"></i>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })

                            :
                            filesList.map((file) => {
                                const format = getFileFormatData(file.name);
                                const isImg = isImageFile(file.name);

                                return (
                                    <a
                                        key={file.id}
                                        href={`${BASE_URL}/file/${file.id}`}
                                        className={`group relative flex flex-col p-4 rounded-[2rem] border transition-all duration-500 ${isDarkMode
                                            ? "bg-[#1c1f23] border-white/5 hover:border-blue-500/50 hover:bg-[#23272b] shadow-2xl shadow-black/20"
                                            : "bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-200"
                                            }`}
                                    >
                                        {/* PREVIEW BOX */}
                                        <div className="aspect-square w-full rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-[#0d0f10] flex items-center justify-center mb-4 relative">
                                            {isImg ? (
                                                <img
                                                    src={`${BASE_URL}/file/${file.id}`}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className={`w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110 ${format.bg} ${format.color}`}>
                                                    <span className="text-6xl drop-shadow-md">{format.icon}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-60">{format.type}</span>
                                                </div>
                                            )}

                                            {/* Glass Overlay on Hover */}
                                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        {/* FILE INFO */}
                                        <div className="px-1">
                                            <h3 className={`text-[13px] font-bold truncate tracking-tight mb-1 ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>
                                                {file.name}
                                            </h3>

                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${isDarkMode ? "bg-white/5 text-gray-500" : "bg-slate-100 text-slate-400"}`}>
                                                    {formatSize(file.size)}
                                                </span>
                                                <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">
                                                    {file.timeStamp.fileCreatedAt.split("T")[0]}
                                                </span>
                                            </div>
                                        </div>

                                        {/* FLOATING ACTION ICON */}
                                        <div className="absolute top-6 right-6 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/40">
                                                <i className="ri-arrow-right-up-line text-sm"></i>
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