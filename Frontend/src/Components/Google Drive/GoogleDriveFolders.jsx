import React, { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function GoogleDriveFolders() {
  const { isDarkMode, googleDriveFilesData } = useContext(BastaStorageContext);

  const folders = googleDriveFilesData.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder"
  );

  return (
    <div className="w-full px-2 ">
      {/* GRID CONTAINER - 1 col on mobile, 2 on tablet, 3 on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => window.open(folder.webViewLink, "_blank")}
            className={`group cursor-pointer relative flex items-center p-3 rounded-2xl border transition-all duration-300 transform active:scale-95 ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50 shadow-2xl shadow-black/20"
                : "bg-white border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:bg-blue-50/30"
            }`}
          >
            {/* FOLDER ICON WITH GLASS EFFECT */}
            <div className="relative flex-shrink-0 mr-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                isDarkMode ? "bg-yellow-500/10" : "bg-yellow-100"
              }`}>
                {/* Modern Folder Icon */}
                <i className="ri-folder-shared-fill text-3xl text-yellow-500 drop-shadow-[0_2px_4px_rgba(234,179,8,0.3)]"></i>
                
                {/* Floating Drive Badge */}
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-100/10">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
                    className="w-3 h-3 object-contain"
                    alt="drive-logo"
                  />
                </div>
              </div>
            </div>

            {/* FOLDER INFO */}
            <div className="flex-grow min-w-0 pr-6">
              <h4 className={`text-sm font-bold tracking-tight truncate ${
                isDarkMode ? "text-slate-100" : "text-slate-800"
              }`}>
                {folder.name}
              </h4>
              <p className={`text-[10px] font-medium uppercase tracking-widest opacity-40 mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Google Drive Folder
              </p>
            </div>

            {/* INTERACTIVE ARROW (Better than just a dot) */}
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
               <i className="ri-arrow-right-s-line text-blue-500 text-xl"></i>
            </div>
            
            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {folders.length === 0 && (
          <div className={`col-span-full py-16 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center ${
            isDarkMode ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50/50"
          }`}>
            <div className="w-16 h-16 bg-gray-200/20 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
               <i className="ri-folder-info-line text-3xl opacity-20"></i>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-30">No Folders Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleDriveFolders;