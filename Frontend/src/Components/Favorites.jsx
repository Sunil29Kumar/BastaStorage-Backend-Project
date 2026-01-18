import React, { useContext, useEffect, useState, useRef } from 'react';
import { BastaStorageContext } from '../hooks/Context/ContextAPI';
import { fileFormats } from "../Utils/FileTypes.jsx";
// import { formatSize } from "../../Utils/formatSize.js";
import { GridCard } from "./RecentFiles"; // Hum purane GridCard ko reuse kar sakte hain

function Favorites() {
    const {
        isDarkMode, BASE_URL, renameFile, handleDeleteFile,
        setShowFileRenameInputBox, setShowFileInfo, setFileInfo,
        setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied,
        isClickOnDeleteFileFolderButton, filesList, handleFavoriteFile
    } = useContext(BastaStorageContext);

    const [openMenueId, setOpenMenueId] = useState(null);
    const [isShareFileHover, setIsShareFileHover] = useState(false);
    const menuRef = useRef(null);

    // Filter only starred files
    const starredFiles = filesList.filter(file => file.isStarred === true);

    // Handle outside click
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
        getFileFormatData, getExtension, isClickOnDeleteFileFolderButton,
        handleFavoriteFile // Naya feature toggle ke liye
    };

    return (
        <div className={`mt-1 p-5 min-h-[85vh] rounded-b-4xl rounded-t-xl transition-all ${isDarkMode ? "bg-[#111315] border border-white/5" : "bg-white shadow-sm border border-gray-100 text-gray-800"}`}>

            {/* --- Header Section --- */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                    <i className="ri-star-fill text-2xl text-yellow-500"></i>
                </div>
                <div>
                    <h4 className="text-xl font-black tracking-tight">Starred Files</h4>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mt-0.5">
                        {starredFiles.length} favorite items
                    </p>
                </div>
            </div>

            {/* --- Content --- */}
            {starredFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {starredFiles.map((file) => (
                        <GridCard key={file._id} file={file} {...actionProps} />
                    ))}
                </div>
            ) : (
                <div className="h-[50vh] flex flex-col items-center justify-center opacity-20">
                    <i className="ri-star-line text-7xl"></i>
                    <p className="text-sm font-bold mt-4 uppercase tracking-widest">No starred files yet</p>
                    <p className="text-[10px] mt-1">Mark important files as favorite to see them here</p>
                </div>
            )}
        </div>
    );
}

export default Favorites;