import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { RiCheckboxCircleLine, RiCloseCircleLine, RiInformationLine, RiRefreshLine } from 'react-icons/ri';

function FileDeleteRenameMessage() {
    const { isDarkMode, fileRenameMessage, fileDeleteMessage } = useContext(BastaStorageContext);

    const Toast = ({ message, error, type }) => {
        if (!message && !error) return null;

        const isError = error && error.length > 0;
        const text = isError ? error : message;

        // Dynamic Color Logic
        const theme = isError 
            ? { bg: "bg-rose-500", shadow: "shadow-rose-500/20", icon: <RiCloseCircleLine /> }
            : type === 'delete' 
                ? { bg: "bg-emerald-500", shadow: "shadow-emerald-500/20", icon: <RiCheckboxCircleLine /> }
                : { bg: "bg-blue-600", shadow: "shadow-blue-600/20", icon: <RiRefreshLine /> };

        return (
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-3xl shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 ${theme.bg} ${theme.shadow}`}>
                
                {/* White Glowy Icon Container */}
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md text-white text-xl">
                    {theme.icon}
                </div>

                <div className="flex flex-col pr-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 leading-none mb-1">
                        {isError ? "System Alert" : type === 'delete' ? "Action Completed" : "Update Success"}
                    </span>
                    <p className="text-sm font-bold text-white tracking-tight leading-none">
                        {text}
                    </p>
                </div>

                {/* Vertical Separator */}
                <div className="w-[1px] h-8 bg-white/20"></div>

                {/* Close/Dismiss indicator */}
                <button className="text-white/40 hover:text-white transition-colors">
                    <RiCloseCircleLine className="text-lg" />
                </button>
            </div>
        );
    };

    return (
        <>
            <Toast 
                message={fileRenameMessage.message} 
                error={fileRenameMessage.error} 
                type="rename" 
            />
            <Toast 
                message={fileDeleteMessage.message} 
                error={fileDeleteMessage.error} 
                type="delete" 
            />
        </>
    );
}

export default FileDeleteRenameMessage;