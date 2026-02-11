import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { RiCloudLine, RiCloseLine, RiCheckLine, RiLoader4Line } from 'react-icons/ri';

function GoogleDriveFileProgress() {
    const { transferProgress, setTransferProgress, isDarkMode } = useContext(BastaStorageContext);

    if (!transferProgress || transferProgress.progress === 0) return null;

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isComplete = transferProgress.progress === 100;

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-[380px] z-[999999] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`relative overflow-hidden p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-500 ${
                isDarkMode 
                ? "bg-gray-900/90 border-white/10 shadow-black/60" 
                : "bg-white/90 border-gray-200/80 shadow-blue-500/10"
            }`}>
                
                {/* Slim Progress Bar at Top Edge */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-black/5 dark:bg-white/5">
                    <div 
                        className={`h-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${transferProgress.progress}%` }}
                    />
                </div>

                <div className="flex items-center gap-4 mt-1">
                    {/* Minimal Icon Status */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                        isComplete ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                    }`}>
                        {isComplete ? (
                            <RiCheckLine size={22} className="animate-in zoom-in" />
                        ) : (
                            <RiLoader4Line size={22} className="animate-spin" />
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-end mb-1">
                            <h4 className={`text-[11px] font-semibold uppercase tracking-wider ${isComplete ? 'text-green-500' : 'text-blue-500'}`}>
                                {isComplete ? "Transfer Complete" : `Transferring... ${transferProgress.progress}%`}
                            </h4>
                            <span className="text-[10px] opacity-50 font-medium">
                                {formatBytes(transferProgress.fileSize)}
                            </span>
                        </div>
                        
                        <p className={`text-sm font-medium truncate pr-4 ${isDarkMode ? 'text-white/90' : 'text-gray-800'}`}>
                            {transferProgress.fileName || "Processing file..."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {!isComplete && (
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2" />
                        )}
                        <button
                            onClick={() => setTransferProgress({ ...transferProgress, progress: 0 })}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                            } opacity-40 hover:opacity-100`}
                        >
                            <RiCloseLine size={18} />
                        </button>
                    </div>
                </div>

                {/* Subtle Background Text */}
                <div className="flex justify-end mt-2">
                    <span className="text-[8px] font-bold tracking-[0.2em] uppercase opacity-20">
                        Basta Cloud Engine
                    </span>
                </div>
            </div>
        </div>
    );
}

export default GoogleDriveFileProgress;