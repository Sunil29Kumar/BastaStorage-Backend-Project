import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { RiCloudLine, RiCloseLine, RiCheckLine } from 'react-icons/ri';

function GoogleDriveFileProgress() {
    const { transferProgress, setTransferProgress, isDarkMode } = useContext(BastaStorageContext);

    if (!transferProgress || transferProgress.progress === 0) return null;

    // Bytes ko human-readable format mein badalne ke liye
    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isComplete = transferProgress.progress === 100;

    return (
        <div className="fixed bottom-4 right-4 w-[32vw] max-w-[420px] z-[2000] animate-in slide-in-from-right-10 fade-in duration-500">
            <div className={`relative overflow-hidden p-5 rounded-[2.5rem] shadow-2xl border backdrop-blur-xl transition-all duration-500 ${
                isDarkMode 
                ? "bg-gray-900/95 border-white/10 shadow-black/40" 
                : "bg-white/95 border-gray-200/50 shadow-blue-500/10"
            }`}>
                
                {/* Background Subtle Progress Glow */}
                <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-500 opacity-30"
                    style={{ width: `${transferProgress.progress}%` }}
                />

                <div className="flex items-start gap-4">
                    {/* Icon Section */}
                    <div className="relative shrink-0">
                        {transferProgress.progress < 100 && (
                            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                        )}
                        <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            isComplete ? "bg-green-500" : "bg-blue-600"
                        } text-white shadow-lg`}>
                            {isComplete ? <RiCheckLine size={24} /> : <RiCloudLine size={24} className="animate-pulse" />}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="truncate pr-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">
                                    {isComplete ? "Sync Completed" : "Syncing to Basta"}
                                </h4>
                                <p className="text-sm font-bold truncate max-w-[180px]">
                                    {transferProgress.fileName || "Unknown File"}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-black italic ${isComplete ? "text-green-500" : "text-blue-500"}`}>
                                    {transferProgress.progress}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className={`h-2.5 w-full rounded-full p-[2px] mb-2 ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ease-out relative ${
                                    isComplete ? "bg-green-500" : "bg-blue-600"
                                }`}
                                style={{ width: `${transferProgress.progress}%` }}
                            >
                                {!isComplete && (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                             <p className="text-[10px] font-bold opacity-40">
                                {formatBytes(transferProgress.fileSize)}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-tighter opacity-30">
                                Cloud Transfer Engine v2
                            </p>
                        </div>
                    </div>

                    {/* Close Action */}
                    <button
                        onClick={() => setTransferProgress({ ...transferProgress, progress: 0 })}
                        className={`shrink-0 p-1.5 rounded-xl transition-all ${
                            isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                        } opacity-40 hover:opacity-100`}
                    >
                        <RiCloseLine size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GoogleDriveFileProgress;