import { FaGoogleDrive, FaHdd } from "react-icons/fa";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { useContext } from "react";

function StorageCards() {
  const { isDarkMode, filesList, storageData } = useContext(BastaStorageContext);

  const totalGB = (storageData?.totalSpace / (1024 ** 3)).toFixed(2);

  // Storage Logic
  const getUsedBySource = (source) => {
    return (filesList
      .filter((file) => file.uploadedFrom?.source === source)
      .reduce((acc, file) => acc + (file.size || 0), 0) / (1024 ** 3)).toFixed(2);
  };

  const cards = [
    {
      name: "Local Storage",
      used: getUsedBySource("Local Storage"),
      total: totalGB,
      icon: <FaHdd />,
      // Create New Button jaisa gradient
      bg: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600",
      text: "text-white",
      isPremium: true
    },
    {
      name: "Google Drive",
      used: getUsedBySource("Google Drive"),
      total: totalGB,
      icon: <FaGoogleDrive className="text-blue-500" />,
      bg: isDarkMode ? "bg-gray-800 border border-white/10" : "bg-white border border-gray-100",
      text: isDarkMode ? "text-white" : "text-gray-800",
      isPremium: false
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((item, i) => {
        const percent = Math.min(Math.round((item.used / item.total) * 100), 100) || 0;
        const radius = 20;
        const circumference = 2 * Math.PI * radius;

        return (
          <div
            key={i}
            className={`${item.bg} ${item.text} rounded-[2rem] p-5 shadow-xl shadow-blue-500/10 transition-transform hover:scale-[1.02] duration-300 flex items-center justify-between group`}
          >
            <div className="flex items-center gap-4">
              {/* Icon Box */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:rotate-12 ${
                item.isPremium ? "bg-white/20" : "bg-blue-50 dark:bg-blue-500/10"
              }`}>
                <span className="text-2xl">{item.icon}</span>
              </div>

              <div>
                <h3 className="font-bold tracking-tight">{item.name}</h3>
                <p className={`text-xs mt-1 font-medium ${item.isPremium ? "text-blue-100" : "opacity-50"}`}>
                  {item.used} GB / {item.total} GB
                </p>
              </div>
            </div>

            {/* CIRCULAR PROGRESS */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28" cy="28" r={radius}
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  className={`${item.isPremium ? "opacity-20" : "opacity-10"}`}
                />
                <circle
                  cx="28" cy="28" r={radius}
                  strokeWidth="4"
                  stroke={item.isPremium ? "#FFFFFF" : "#3B82F6"}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (percent / 100) * circumference}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-black uppercase">
                {percent}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StorageCards;