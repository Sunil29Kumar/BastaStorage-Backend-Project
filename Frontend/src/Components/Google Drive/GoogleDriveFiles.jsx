import React, { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function GoogleDriveFiles() {
  const {
    isDarkMode,
    googleDriveFilesData,
    sendDriveFilesData,
    googleDriveFileLoading,
  } = useContext(BastaStorageContext);

  // Loading Skeletons dikhayenge jab tak data load ho raha hai
  if (googleDriveFileLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 w-full">
        {/* Hum 4 Skeleton cards dikhayenge taki layout khali na lage */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`relative h-44 rounded-[2rem] overflow-hidden border transition-all ${isDarkMode ? "bg-white/5 border-white/5" : "bg-gray-100 border-transparent"
              }`}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>

            <div className="flex flex-col h-full p-4 justify-between">
              {/* Top Icon Circle Placeholder */}
              <div className={`w-full h-2/3 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-gray-200"}`}></div>

              {/* Text Placeholders */}
              <div className="space-y-2 px-2 flex flex-col ">
                <div className={`h-3 w-3/4 rounded-full ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`}></div>
                <div className={`h-2 w-1/3 rounded-full ${isDarkMode ? "bg-white/5" : "bg-gray-200"}`}></div>
              </div>
            </div>
          </div>
        ))}

        {/* Ek Floating Status Indicator (Optional) */}
        <div className="col-span-2 flex items-center justify-center py-4 gap-3">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          </div>
          <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${isDarkMode ? "text-white" : "text-black"}`}>
            Processing Cloud Data
          </p>
        </div>

      </div>
    );
  }


  return (
    <div className="grid md:grid-cols-1  lg:grid-cols-2 xl:grid-cols-4  gap-3">
      {googleDriveFilesData
        .filter(
          (f) =>
            f.mimeType !== "application/vnd.google-apps.folder"
        )
        .map((file) => (
          <div
            key={file.id}
            onClick={() => {
              sendDriveFilesData({
                id: file.id,
                createdTime: file.createdTime,
                mimeType: file.mimeType,
                name: file.name,
                size: file.size,
                thumbnailLink: file.thumbnailLink,
                webViewLink: file.webViewLink,
              })
            }
            }
            className={`group rounded-xl cursor-pointer overflow-hidden transition 
              ${isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:shadow-lg"
              }`}
          >
            {/* IMAGE */}
            <div className="relative h-[140px] flex items-center justify-center">
              <img
                src={file.thumbnailLink}
                alt={file.name.slice(0, 10)}
                className="h-full w-full object-cover"
              />

              {/* hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <i
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.webViewLink);
                  }}
                  className="ri-eye-line text-white text-2xl"
                />
              </div>
            </div>

            {/* INFO STRIP */}
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">
                {file.name}
              </p>
              <p className="text-xs opacity-60">
                {file.mimeType.split("/")[1] || "file"}
              </p>
            </div>
          </div>
        ))
      }
    </div >
  );
}

export default GoogleDriveFiles;
