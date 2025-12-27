import { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function GoogleDrive() {
  const {
    isDarkMode,
    setShowFileFolderMenu,
    googleDriveFiles,
    setIsGDBoxOpen,
    googleDriveFilesData,
    isNavMinimized,
    setIsNavMinimized
  } = useContext(BastaStorageContext);

  const handleClick = () => {
    if (googleDriveFilesData.length === 0) {
      googleDriveFiles(); // first time fetch
    }
    setIsGDBoxOpen(true);
    setShowFileFolderMenu(false);
  };

  return (
    <button
      onClick={() => {
        handleClick()
        setIsNavMinimized(true);
      }}
      className={`
        w-full flex items-center gap-3
        ${isNavMinimized ? "px-2 py-2" : "px-4 py-2"} rounded-lg
        transition-all duration-200
        cursor-pointer
        ${isDarkMode
          ? "hover:bg-gray-700 text-gray-200"
          : "hover:bg-gray-100 text-gray-700"}
      `}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center rounded-md bg-white ${isNavMinimized ? "w-11 h-11" : "w-9 h-9"}`}>
        <img
          src="/google drive.png"
          alt="Google Drive"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      {!isNavMinimized && <span className="text-sm font-medium">Google Drive</span>}
    </button>
  );
}

export default GoogleDrive;
