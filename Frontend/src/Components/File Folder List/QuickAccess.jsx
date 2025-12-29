import { useContext } from "react";
import {
  FaImage, FaVideo, FaMusic, FaThLarge,
  FaFileArchive, FaFileAlt, FaDownload, FaPlus,
} from "react-icons/fa";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function QuickAccess() {
  const { 
    currentQuickAccessFile, isDarkMode, setCurrentQuickAccessFile, 
    uploadFile, setIsGDBoxOpen, setShowInputBox 
  } = useContext(BastaStorageContext);

  const items = [
    { name: "Images", icon: <FaImage />, bg: "bg-purple-500/10", color: "text-purple-500", extension: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"] },
    { name: "Videos", icon: <FaVideo />, bg: "bg-red-500/10", color: "text-red-500", extension: [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv"] },
    { name: "Music", icon: <FaMusic />, bg: "bg-orange-500/10", color: "text-orange-500", extension: [".mp3", ".wav", ".flac", ".aac", ".ogg"] },
    { name: "Apps", icon: <FaThLarge />, bg: "bg-blue-500/10", color: "text-blue-500", extension: [".exe", ".dmg", ".apk", ".app", ".bat"] },
    { name: "Zip Files", icon: <FaFileArchive />, bg: "bg-gray-500/10", color: "text-gray-500", extension: [".zip", ".rar", ".7z", ".tar", ".gz"] },
    { name: "Docs", icon: <FaFileAlt />, bg: "bg-sky-500/10", color: "text-sky-500", extension: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"] },
    { name: "Downloads", icon: <FaDownload />, bg: "bg-green-500/10", color: "text-green-500", extension: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip", ".rar", ".7z", ".tar", ".gz", ".mp3", ".wav", ".flac", ".aac", ".ogg", ".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"] },
  ];

  return (
    <div className="w-full">
      <h2 className={`text-lg font-black   mb-5 ${isDarkMode ? "text-white/90" : "text-gray-800"}`}>
        Quick Access
      </h2>

      {/* Container with Horizontal Scroll for Mobile */}
      <div className="flex gap-6 items-start overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
        {items.map((item, i) => {
          // Check if this item is currently selected
          const isActive = JSON.stringify(currentQuickAccessFile) === JSON.stringify(item.extension);

          return (
            <div
              onClick={() => setCurrentQuickAccessFile(item.extension)}
              key={i}
              className="flex flex-col items-center cursor-pointer group min-w-[70px]"
            >
              {/* Icon Container */}
              <div className={`
                w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? "bg-blue-600 shadow-lg shadow-blue-500/40 rotate-[-5deg]" 
                  : isDarkMode ? "bg-gray-800 border border-white/5" : "bg-white shadow-sm border border-gray-100"
                }
                group-hover:scale-110 group-active:scale-95
              `}>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors
                  ${isActive ? "bg-white/20 text-white" : `${item.bg} ${item.color}`}
                `}>
                  {item.icon}
                </div>
              </div>

              {/* Label */}
              <p className={`
                text-[11px] font-bold mt-3 transition-colors uppercase tracking-tighter
                ${isActive ? "text-blue-500" : isDarkMode ? "text-gray-400" : "text-gray-600"}
              `}>
                {item.name}
              </p>
            </div>
          );
        })}

        {/* --- ADD NEW BUTTON --- */}
        <div className="flex flex-col items-center min-w-[70px] group">
          <label className={`
            w-16 h-16 rounded-[1.8rem] border-2 border-dashed flex items-center justify-center cursor-pointer 
            transition-all duration-300 hover:rotate-90
            ${isDarkMode
              ? "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10"
              : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
            }
          `}>
            <FaPlus className={`text-xl ${isDarkMode ? "text-gray-600" : "text-gray-400"} group-hover:text-blue-500 transition-colors`} />
            <input
              type="file"
              name="file"
              onClick={() => {
                setIsGDBoxOpen(false);
                setShowInputBox(false);
              }}
              onChange={(e) => uploadFile(e)}
              className="hidden" 
            />
          </label>
          <p className="text-[11px] font-bold mt-3 text-gray-400 uppercase tracking-tighter opacity-60">Add New</p>
        </div>
      </div>
    </div>
  );
}

export default QuickAccess;