import { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { FaCloudUploadAlt } from "react-icons/fa";

function UploadFile() {
  const {
    uploadFile,
    setIsGDBoxOpen,
    setShowInputBox,
    isDarkMode,
    isNavMinimized, windowWidth ,setShowFileFolderMenu
  } = useContext(BastaStorageContext);

  return (
    <label
      className={`
        w-full flex items-center gap-3
        px-4 py-3 rounded-lg
        cursor-pointer
        transition-all duration-200
        ${isDarkMode
          ? "text-gray-200 hover:bg-gray-700"
          : "text-gray-700 hover:bg-gray-100"}
       ${isNavMinimized ? "justify-center px-0  " : ""}
          `}
    >
      {/* Icon */}
      <div
        className={`
           rounded-md
          ${isDarkMode ? "bg-gray-600" : "bg-green-100"}
        `}
      >
        <FaCloudUploadAlt
          className={`${isDarkMode ? "text-green-400 text-3xl" : "text-green-600 text-3xl"}`}
        />
      </div>

      {/* Text */}
      {(!isNavMinimized || windowWidth < 1000) && <span className="text-md">Upload file</span>}

      {/* Hidden Input */}
      <input
        type="file"
        name="file"
        onClick={() => {
          setIsGDBoxOpen(false);
          setShowInputBox(false);
          setShowFileFolderMenu(false);
        }}
        onChange={(e) => uploadFile(e)}
        className="hidden"
      />
    </label>
  );
}

export default UploadFile;
