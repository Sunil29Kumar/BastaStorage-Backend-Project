import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { RiCloudLine, RiCloseLine } from 'react-icons/ri';

function GoogleDriveFileProgress() {
    const { transferProgress, setTransferProgress, isDarkMode } = useContext(BastaStorageContext);

    // Agar progress 0 hai ya 100 complete ho gaya hai toh hide kar do
    if (transferProgress === 0) return null;
    

    return (
        <div className={`fixed bottom-2 right-1 w-[28vw] max-w-[400px] z-[2000] animate-in slide-in-from-bottom-10 duration-500`}>
            <div className={`p-4 rounded-[2rem] shadow-2xl border backdrop-blur-md ${isDarkMode
                    ? "bg-gray-900/90 border-white/10 text-white"
                    : "bg-white/90 border-gray-100 text-black"
                }`}>

                <div className="flex items-center gap-4 mb-3">
                    {/* Pulsing Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-lg shadow-blue-500/30`}>
                            <RiCloudLine className="text-xl" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                            <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Syncing File...</h4>
                            <span className="text-sm font-black text-blue-500">{transferProgress}%</span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-gray-100"}`}>
                            {/* Animated Progress Fill */}
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                style={{ width: `${transferProgress}%` }}
                            >
                                {/* Shimmering effect inside bar */}
                                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Button */}
                    <button
                        onClick={() => setTransferProgress(0)}
                        className={`p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-40 hover:opacity-100`}
                    >
                        <RiCloseLine size={20} />
                    </button>
                </div>

                <p className={`text-[9px] font-bold uppercase tracking-tighter opacity-40 ml-14`}>
                    Cloud to Basta Storage Transfer in progress
                </p>
            </div>
        </div>
    );
}

export default GoogleDriveFileProgress;