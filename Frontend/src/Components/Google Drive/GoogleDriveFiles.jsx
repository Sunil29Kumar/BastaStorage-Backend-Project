import React, { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function GoogleDriveFiles() {
  const {
    isDarkMode,
    googleDriveFilesData,
    sendDriveFilesData,
    googleDriveFileLoading,
  } = useContext(BastaStorageContext);

  if (googleDriveFileLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-1  lg:grid-cols-2  gap-3">
      {googleDriveFilesData
        .filter(
          (f) =>
            f.mimeType !== "application/vnd.google-apps.folder"
        )
        .map((file) => (
          <div
            key={file.id}
            onClick={() =>
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
            className={`group rounded-md cursor-pointer overflow-hidden transition
              ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:shadow-lg"
              }`}
          >
            {/* IMAGE */}
            <div className="relative h-[140px] bg-black/5 flex items-center justify-center">
              <img
                src={file.thumbnailLink}
                alt={file.name.slice(0, 10)}
                className="max-h-full max-w-full object-contain"
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
        ))}
    </div>
  );
}

export default GoogleDriveFiles;
