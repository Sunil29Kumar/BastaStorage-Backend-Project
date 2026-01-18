import { useContext, useEffect, useRef, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { fileFormats } from "../Utils/FileTypes.jsx";
import { formatSize } from "../Utils/formatSize.js";

function RecentFiles() {
    const {
        isDarkMode, BASE_URL, renameFile, handleDeleteFile,
        setShowFileRenameInputBox, setShowFileInfo, setFileInfo,
        setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied,
        isClickOnDeleteFileFolderButton, getRecentFiles, recentFilesList, handleFavoriteFile
    } = useContext(BastaStorageContext);

    const [openMenueId, setOpenMenueId] = useState(null);
    const [isShareFileHover, setIsShareFileHover] = useState(false);
    const menuRef = useRef(null);

    // Fetch recent files only once when component mounts
    useEffect(() => {
        getRecentFiles();
    }, []);

    // Handle outside click to close menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenueId(null);
                setIsShareFileHover(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getExtension = (filename) => filename?.split(".").pop().toLowerCase() || "";

    const getFileFormatData = (filename) => {
        const ext = getExtension(filename);
        const format = fileFormats.find(f => f.extensions.includes(ext));
        return format || fileFormats.find(f => f.type === "Unknown");
    };

    const actionProps = {
        isDarkMode, BASE_URL, openMenueId, setOpenMenueId, menuRef,
        renameFile, setShowFileRenameInputBox, setShowFileInfo, setFileInfo,
        handleDeleteFile, isShareFileHover, setIsShareFileHover,
        setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied,
        getFileFormatData, getExtension, isClickOnDeleteFileFolderButton, handleFavoriteFile
    };

    return (
        <div className={`mt-1 p-3 rounded-b-4xl rounded-t-xl transition-all    `}>

            {/* --- Header Section --- */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <i className="ri-history-line text-2xl text-blue-500"></i>
                </div>
                <div>
                    <h4 className="text-3xl font-black tracking-tight">Recent Files</h4>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mt-0.5">
                        {recentFilesList?.length || 0} items recently accessed
                    </p>
                </div>
            </div>

            {/* --- Grid Content --- */}
            {recentFilesList && recentFilesList.length > 0 ? (
                <div
                    className={` p-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 
                ${isDarkMode ? "bg-[#111315] border border-white/5" : "bg-white shadow-sm border border-gray-100 text-gray-800"}
                `}>
                    {recentFilesList
                        .filter((file) => file.status !== "initiated" && file.status !== "uploading")
                        .map((file) => (
                            <GridCard key={file._id} file={file} {...actionProps} />
                        ))
                    }
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center opacity-20">
                    <i className="ri-file-search-line text-6xl"></i>
                    <p className="text-sm font-bold mt-4">No recent activity found</p>
                </div>
            )}
        </div>
    );
}



// --- Action Menu (Rename/Delete/Download) ---
const ActionMenu = ({ file, isDarkMode, openMenueId, setOpenMenueId, menuRef, renameFile, setShowFileRenameInputBox, setShowFileInfo, setFileInfo, handleDeleteFile, isShareFileHover, setIsShareFileHover, setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied, BASE_URL, getFileFormatData, isClickOnDeleteFileFolderButton, handleFavoriteFile }) => {
    const format = getFileFormatData(file.name);

    return (
        <div className="relative">
            <button
                onClick={() => setOpenMenueId(openMenueId === file._id ? null : file._id)}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${openMenueId === file._id ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-500/10"}`}
            >
                <i className="ri-more-2-fill text-xl"></i>
            </button>

            {openMenueId === file._id && (
                <div
                    ref={menuRef}
                    className={`absolute z-50 right-0 bottom-full mb-2 w-52 rounded-2xl shadow-2xl border py-2 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 ${isDarkMode ? "bg-gray-900/95 border-white/10 shadow-black" : "bg-white border-gray-100 shadow-blue-500/10"}`}
                >
                    <div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest opacity-30 border-b border-white/5 mb-1">Actions</div>

                    <MenuBtn icon={`ri-star-${file.isStarred ? "fill text-yellow-400" : "line"}`} label="Add to Favorites"
                        onClick={() => { handleFavoriteFile(file._id); }}
                        isDarkMode={isDarkMode} />

                    <MenuBtn icon="ri-download-cloud-2-line" label="Download" onClick={() => window.open(`${BASE_URL}/file/${file._id}?action=download`)} isDarkMode={isDarkMode} />

                    <MenuBtn icon="ri-edit-circle-line" label="Rename" onClick={() => { renameFile(file._id, file.name); setShowFileRenameInputBox(true); setOpenMenueId(null); }} isDarkMode={isDarkMode} />

                    <MenuBtn icon="ri-information-line" label="Details" onClick={() => { setFileInfo([{ fileId: file._id, icon: format.icon, fileName: file.name, fileSize: formatSize(file.size), fileCreationDate: file.timeStamp.fileCreatedAt }]); setShowFileInfo(true); setOpenMenueId(null); }} isDarkMode={isDarkMode} />

                    <div className="my-1 border-t border-white/5" />

                    <MenuBtn
                        icon="ri-delete-bin-line"
                        label={isClickOnDeleteFileFolderButton ? "Deleting..." : "Delete"}
                        danger
                        onClick={() => { handleDeleteFile(file._id); setOpenMenueId(null); }}
                        isDarkMode={isDarkMode}
                    />
                </div>
            )}
        </div>
    );
};


// --- Individual Grid Card ---
export const GridCard = (props) => {
    const format = props.getFileFormatData(props.file.name);
    const isImage = ["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(props.getExtension(props.file.name));

    return (
        <div className={`group relative p-3 rounded-3xl border transition-all duration-300 flex flex-col ${props.isDarkMode ? "bg-gray-800/40 border-gray-700 hover:bg-gray-800 hover:border-blue-500" : "bg-white border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-300"}`}>

            {/* Clickable Preview Area */}
            <a
                href={`${props.BASE_URL}/file/${props.file._id}`}
                target="_blank"
                rel="noreferrer"
                className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
            >
                {isImage ? (
                    <img
                        src={`${props.BASE_URL}/file/${props.file._id}`}
                        alt={props.file.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110 ${format.bg} ${format.color}`}>
                        {format.icon}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Bottom Info Section */}
            <div className="flex justify-between items-center px-1">
                <div className="flex flex-col overflow-hidden gap-0.5">
                    <span className="text-[13px] font-bold truncate leading-tight" title={props.file.name}>
                        {props.file.name}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ${props.isDarkMode ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                            {format.type}
                        </span>
                        <span className="text-[10px] opacity-40 font-medium">
                            {formatSize(props.file.size)}
                        </span>
                    </div>
                </div>

                {/* Actions Menu Component */}
                <ActionMenu {...props} />
            </div>
        </div>
    );
};

const MenuBtn = ({ icon, label, onClick, isDarkMode, danger }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all ${danger ? "text-red-500 hover:bg-red-500/10" : isDarkMode ? "text-gray-300 hover:bg-white/5 hover:text-blue-400" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}`}
    >
        <i className={`${icon} text-lg`}></i> {label}
    </button>
);

export default RecentFiles;