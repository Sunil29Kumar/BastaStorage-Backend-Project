import { FaDropbox, FaGoogleDrive, FaHdd } from "react-icons/fa";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { useContext } from "react";
// import { SiMicrosoftonedrive } from "react-icons/si";

function StorageCards() {
  const { isDarkMode, filesList, BASE_URL, storageData } = useContext(BastaStorageContext);

  const cards = [

    {
      name: "Local Storage",
      used: 83,
      total: (storageData?.totalSpace / (1024 ** 3)).toFixed(2), // in GB
      icon: <FaHdd className="text-white text-xl" />,
      bg: "bg-blue-500",
      text: "text-white",
    },
    {
      name: "Google Drive",
      used: 83,
      total: (storageData?.totalSpace / (1024 ** 3)).toFixed(2), // in GB

      icon: <FaGoogleDrive className="text-blue-500 text-xl" />,
      bg: "bg-white",
      text: "text-gray-800",
    },
    // {
    //   name: "Dropbox",
    //   used: 67,
    // total: (storageData?.totalSpace / (1024 ** 3)).toFixed(2), // in GB

    //   icon: <FaDropbox className="text-blue-500 text-xl" />,
    //     bg: "bg-white",
    //   text: "text-gray-800",
    // },
    // {
    //   name: "One Drive",
    //   used: 124,
    //   total: (storageData?.totalSpace / (1024 ** 3)).toFixed(2), // in GB

    //   //   icon: < className="text-blue-600 text-xl" />,
    //   icon: <FaGoogleDrive className="text-blue-600 text-xl" />,
    //   bg: "bg-white",
    //   text: "text-gray-800",
    // },
  ];

  const usedStorage = storageData?.usedSpace || 0;


  // find total storage used by files provider 
  const googleDriveUsed = filesList.filter((file) => {
    return file.uploadedFrom?.source === "Google Drive";
  }).reduce((acc, file) => acc + (file.size || 0), 0);


  const localStorageUsed   = filesList.filter((file) => {
    return file.uploadedFrom?.source === "Local Storage";
  }).reduce((acc, file) => acc + (file.size || 0), 0);


  // update used storage in cards

  cards[0].used = (localStorageUsed / (1024 ** 3)).toFixed(2); // Local Storage in GB
  cards[1].used = (googleDriveUsed / (1024 ** 3)).toFixed(2); // Google Drive in GB

  console.log(cards);
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((item, i) => {
        const percent = Math.round((item.used / item.total) * 100);

        return (
          <div
            key={i}
            className={`${item.bg} ${item.text} rounded-xl p-5 shadow-md flex items-center justify-between`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.bg === "bg-white" ? "bg-blue-50" : "bg-blue-400"
                  }`}
              >
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm opacity-80">
                  {item.used} Gb / {item.total} Gb
                </p>
              </div>
            </div>

            {/* RIGHT – CIRCULAR PROGRESS */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  strokeWidth="4"
                  stroke={item.bg === "bg-white" ? "#E5E7EB" : "#93C5FD"}
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  strokeWidth="4"
                  stroke={item.bg === "bg-white" ? "#3B82F6" : "#FFFFFF"}
                  fill="none"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={
                    2 * Math.PI * 20 -
                    (percent / 100) * 2 * Math.PI * 20
                  }
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
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
