import React, { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function FolderInformation() {
  const { isDarkMode, setShowFolderInfo, folderInfo } = useContext(BastaStorageContext);

  const infoRef = useRef(null);


  return (
    <div
      ref={infoRef}
      className={`relative top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[90vh] rounded-2xl  shadow-2xl overflow-hidden transform transition-all animate-in slide-in-from-bottom-4 duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700"
        : "bg-gradient-to-br bg-gray-300 border-gray-200"
        }`}
    >
      {folderInfo.length > 0 && (
        <div className="flex flex-col h-full ">
          {/* Header Section */}
          <div className={`relative px-6 py-5 `}>
            <div className="flex items-start gap-3 pr-10">

              {/* Folder Icon with Background */}
              <div className={`p-3 rounded-xl ${isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                }`}>
                <span className="text-3xl">🗂️</span>
              </div>

              {/* Folder Name */}
              <div className="flex-1 min-w-0">
                <h2 className={`text-xl font-bold truncate ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                  {folderInfo[0].folderName.length > 25
                    ? folderInfo[0].folderName.slice(0, 25) + "..."
                    : folderInfo[0].folderName}
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  Folder Information
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowFolderInfo(false)}
              className={`absolute top-5 right-5 p-2  transition-all duration-200  px-3 py-2  rounded-full cursor-pointer  ${isDarkMode
                ? "hover:bg-gray-500/20 text-gray-400 hover:text-gray-300"
                : "hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                }`}
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
          </div>

          {/* Content Section */}
          <div className={`px-6 py-5 overflow-y-auto  custom-scrollbar
            [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-blue-400
              [&::-webkit-scrollbar-thumb]:rounded-full
            `}>
            <div className="space-y-4">

              {/* Folder ID */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`ri-hashtag text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}></i>
                  <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    Folder ID
                  </span>
                </div>
                <p className={`text-sm font-mono break-all ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  {folderInfo[0].folderId}
                </p>
              </div>

              {/* Folder Name */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`ri-folder-line text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}></i>
                  <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    Folder Name
                  </span>
                </div>
                <p className={`text-sm break-words ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  {folderInfo[0].folderName}
                </p>
              </div>

              {/* Folder Size */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`ri-database-2-line text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}></i>
                  <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    Size
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  {folderInfo[0].folderSize}
                </p>
              </div>

              {/* Created At */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`ri-calendar-line text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}></i>
                  <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    Created At
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  {folderInfo[0].folderCreationDate}
                </p>
              </div>

              {/* Opened History */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <i className={`ri-eye-line text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}></i>
                  <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    Opened History
                  </span>
                </div>
                {folderInfo[0].folderOpendedDate?.length > 0 ? (
                  <div className="space-y-2">
                    {folderInfo[0].folderOpendedDate.map((data, i) => (
                      <div
                        key={i}
                        className={`text-sm px-3 py-2 rounded-lg ${isDarkMode
                          ? "bg-gray-700/50 text-gray-400"
                          : "bg-white text-gray-600"
                          }`}
                      >
                        <i className="ri-time-line mr-2 text-xs"></i>
                        {data}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}>
                    No history available
                  </p>
                )}
              </div>

              {/* Last Modified */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <i className={`ri-edit-line text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}></i>
                  <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    Last Modified
                  </span>
                </div>
                {folderInfo[0].folderLastModified?.length > 0 ? (
                  <div className="space-y-2">
                    {folderInfo[0].folderLastModified.map((data, i) => (
                      <div
                        key={i}
                        className={`text-sm px-3 py-2 rounded-lg ${isDarkMode
                          ? "bg-gray-700/50 text-gray-400"
                          : "bg-white text-gray-600"
                          }`}
                      >
                        <i className="ri-time-line mr-2 text-xs"></i>
                        {data}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}>
                    Not modified yet
                  </p>
                )}
              </div>
            </div>

          </div>


        </div>
      )}
    </div>


  );
}

export default FolderInformation;