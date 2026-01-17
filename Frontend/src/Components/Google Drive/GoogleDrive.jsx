import { useContext, useMemo } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { FaGoogleDrive } from "react-icons/fa";

function GoogleDrive() {
  const {
    isDarkMode,
    setShowFileFolderMenu,
    googleDriveFiles,
    setIsGDBoxOpen,
    googleDriveFilesData,
    isNavMinimized,
    setIsNavMinimized,
    windowWidth 
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
        setShowFileFolderMenu(false);
      }}
      className={`
        w-full flex items-center gap-3
        ${isNavMinimized ? "px-2 py-2" : "px-4 py-2"} rounded-lg
        transition-all duration-200
        cursor-pointer
        ${isDarkMode
          ? "hover:bg-gray-700 text-gray-200"
          : "hover:bg-gray-100 text-gray-700"}
       ${isNavMinimized ? "justify-center px-0  " : ""}
          `}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center rounded-md  ${isNavMinimized ? "w-11 h-11" : "w-9 h-9"}`}>
        <FaGoogleDrive className={` ${isDarkMode ? "text-blue-600" : "text-blue-500"} ${isNavMinimized ? "text-3xl" : "text-3xl"}`} />
      </div>

      {/* Text */}
      {/* {(!isNavMinimized || (!isNavMinimized && windowWidth > 1285) || (!isNavMinimized && windowWidth >= 1000) || (isNavMinimized && windowWidth < 1000)) && (<span className="text-md">Google Drive</span>)} */}
      {(!isNavMinimized || windowWidth < 1000) && (
        <span className="text-[15px] font-medium">Google Drive</span>
      )}
    </button>
  );
}

export default GoogleDrive;
