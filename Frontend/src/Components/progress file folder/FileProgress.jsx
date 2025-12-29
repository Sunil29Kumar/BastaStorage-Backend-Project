import React, { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function FileProgress() {
  const {
    fileProgress,
    currentFileName,
    setCurrentFileName,
    setFileProgress,
    fileUplodingRemainingTime,
    cancleUpload,
    isDarkMode
  } = useContext(BastaStorageContext);

  if (fileProgress === 0 && !currentFileName) return null;

  const isComplete = fileProgress === 100;

  return (
    <div className="fixed bottom-8 right-8 w-[360px] md:w-[420px] z-[9999] animate-in slide-in-from-right-10 duration-500 ease-out">
      <div className={`relative overflow-hidden rounded-[2.5rem] border shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 ${
        isDarkMode ? "bg-[#111214]/90 border-white/10 backdrop-blur-2xl" : "bg-white/90 border-gray-200 backdrop-blur-2xl"
      }`}>
        
        {/* Animated Background Glow */}
        {!isComplete && (
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] animate-pulse" />
        )}

        <div className="p-6">
          <div className="flex items-center gap-5">
            
            {/* Left Side: Circular Progress + Icon */}
            <div className="relative shrink-0 flex items-center justify-center w-16 h-16">
                <svg className="absolute w-full h-full -rotate-90">
                    <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor" strokeWidth="3" fill="transparent"
                        className={isDarkMode ? "text-white/5" : "text-gray-100"}
                    />
                    <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor" strokeWidth="3" fill="transparent"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * fileProgress) / 100}
                        strokeLinecap="round"
                        className={`transition-all duration-500 ${isComplete ? "text-green-500" : "text-blue-600"}`}
                    />
                </svg>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-white/5" : "bg-blue-50"}`}>
                    <i className={`${isComplete ? "ri-check-double-line text-green-500" : "ri-hard-drive-2-line text-blue-600"} text-2xl`} />
                </div>
            </div>

            {/* Middle Section: Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-end mb-1">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isComplete ? "text-green-500" : "text-blue-500/60"}`}>
                        {isComplete ? "Ready to Use" : "Transferring Data"}
                    </h4>
                    <span className={`text-sm font-black italic ${isComplete ? "text-green-500" : "text-blue-600"}`}>
                        {fileProgress}%
                    </span>
                </div>
                <p className={`text-sm font-bold truncate mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {currentFileName}
                </p>
                
                {/* Time Indicator with Smooth Fade */}
                {!isComplete && (
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 text-[10px] font-black text-blue-600">
                             {fileUplodingRemainingTime}S LEFT
                        </div>
                        <span className="text-[10px] font-bold opacity-30 italic">Calculating optimal speed...</span>
                    </div>
                )}
            </div>

            {/* Right Side: Actions */}
            <div className="flex flex-col gap-2">
                <button 
                   onClick={() => { setCurrentFileName(""); setFileProgress(0); }}
                   className={`p-2 rounded-full transition-all ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"} opacity-40 hover:opacity-100`}
                >
                    <i className="ri-close-line text-lg" />
                </button>
            </div>
          </div>

          {/* Bottom Progress Bar (Slim Line) */}
          <div className="mt-6 relative h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
             <div 
                className={`h-full transition-all duration-700 ease-out relative ${isComplete ? "bg-green-500" : "bg-gradient-to-r from-blue-600 to-indigo-500"}`}
                style={{ width: `${fileProgress}%` }}
             >
                {!isComplete && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                )}
             </div>
          </div>

          {/* Cancel Action Footer (Only visible when active) */}
          {!isComplete && (
            <div className="mt-4 flex justify-end gap-3">
                 <button 
                    onClick={() => { cancleUpload(); setCurrentFileName(""); setFileProgress(0); }}
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all"
                 >
                    <span className="w-0 overflow-hidden group-hover:w-auto transition-all">Abort</span>
                    <i className="ri-close-circle-line text-lg" />
                 </button>
            </div>
          )}
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        `}} />
      </div>
    </div>
  );
}

export default FileProgress;