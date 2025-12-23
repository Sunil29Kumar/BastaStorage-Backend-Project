import { useContext } from "react";
import {
  FaImage,
  FaVideo,
  FaMusic,
  FaThLarge,
  FaFileArchive,
  FaFileAlt,
  FaDownload,
  FaPlus,
} from "react-icons/fa";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function QuickAccess() {

  const { currentQuickAccessFile,isDarkMode, setCurrentQuickAccessFile, uploadFile, setIsGDBoxOpen, setShowInputBox, } = useContext(BastaStorageContext);


  const items = [
    { name: "Images", icon: <FaImage />, bg: "bg-purple-100", color: "text-purple-500", extension: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"] },
    { name: "Videos", icon: <FaVideo />, bg: "bg-red-100", color: "text-red-500", extension: [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv"] },
    { name: "Music", icon: <FaMusic />, bg: "bg-orange-100", color: "text-orange-500", extension: [".mp3", ".wav", ".flac", ".aac", ".ogg"] },
    { name: "Apps", icon: <FaThLarge />, bg: "bg-blue-100", color: "text-blue-500", extension: [".exe", ".dmg", ".apk", ".app", ".bat"] },
    { name: "Zip Files", icon: <FaFileArchive />, bg: "bg-gray-200", color: "text-gray-600", extension: [".zip", ".rar", ".7z", ".tar", ".gz"] },
    { name: "Documents", icon: <FaFileAlt />, bg: "bg-sky-100", color: "text-sky-500", extension: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"] },
    { name: "Downloads", icon: <FaDownload />, bg: "bg-green-100", color: "text-green-500", extension: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip", ".rar", ".7z", ".tar", ".gz", ".mp3", ".wav", ".flac", ".aac", ".ogg", ".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"] },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Quick Access</h2>

      <div className="flex gap-5 items-center  ">
        {items.map((item, i) => (
          <div
            onClick={() => setCurrentQuickAccessFile(item.extension)}
            key={i}
            className="w-20 flex  flex-col items-center cursor-pointer group"
          >
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-105 transition">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}
              >
                {item.icon}
              </div>
            </div>

            <p className="text-sm mt-2 text-gray-700">{item.name}</p>
          </div>
        ))}


        {/* --- MODERN ADD BUTTON --- */}
        <div className="flex flex-col items-center min-w-[80px]">
          <label className={`w-16 h-16 rounded-[1.5rem] border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${isDarkMode
              ? "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5"
              : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
            }`}>
            <FaPlus className={`${isDarkMode ? "text-gray-600" : "text-gray-400"} group-hover:text-blue-500 transition-colors`} />
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
          <p className="text-[11px] font-bold mt-3 text-gray-400 uppercase tracking-tighter">Add New</p>
        </div>
      </div>


    </div>
  );
}

export default QuickAccess;
