import React, { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function GoogleDriveFolders() {
  const { isDarkMode, googleDriveFilesData } = useContext(BastaStorageContext);

  const folders = googleDriveFilesData.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder"
  );

  return (
    <div className="w-full px-2">
      {/* GRID CONTAINER - Optimized for sidebar width */}
      <div className="grid md:grid-cols-1  lg:grid-cols-2  gap-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => window.open(folder.webViewLink, "_blank")}
            className={`group cursor-pointer relative flex flex-col p-4 rounded-lg border transition-all duration-300 ${isDarkMode
                ? "bg-[#1c1f23] border-white/5 hover:bg-[#23272b] hover:border-blue-500/30"
                : "bg-blue-50 border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-blue-100"
              }`}
          >
            {/* FOLDER ICON WITH GOOGLE DRIVE LOGO BADGE */}
            <div className="relative mb-3 flex justify-center">
              <div className="relative inline-block">
                {/* Main Folder Icon */}
                <i className="ri-folder-fill text-[3.5rem] text-yellow-400 drop-shadow-sm group-hover:scale-105 transition-transform duration-300"></i>

                {/* Google Drive Center Badge (Jo aapke screenshot mein hai) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 bg-white/90 dark:bg-gray-800/90 rounded-full p-0.5 shadow-sm border border-gray-100/20">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
                    className="w-3.5 h-3.5 object-contain"
                    alt="drive-logo"
                  />
                </div>
              </div>
            </div>

            {/* FOLDER INFO */}
            <div className="text-center space-y-0.5 mt-1">
              <h4 className={`text-[13px] font-bold leading-tight truncate px-1 ${isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}>
                {folder.name.slice(0, 15) + (folder.name.length > 15 ? "..." : "")}
              </h4>

            </div>

            {/* SELECTION DOT (Like in your screenshot) */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {folders.length === 0 && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center opacity-10">
            <i className="ri-folder-info-line text-5xl"></i>
            <p className="text-[10px] font-black uppercase tracking-widest mt-2">No Folders</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleDriveFolders;