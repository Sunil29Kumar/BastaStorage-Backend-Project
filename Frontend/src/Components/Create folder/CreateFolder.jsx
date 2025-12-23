import { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { FaFolderPlus } from "react-icons/fa";

function CreateFolder() {
  const { isDarkMode, setShowInputBox, setIsGDBoxOpen, isNavMinimized } =
    useContext(BastaStorageContext);

  return (
    <button
      onClick={() => {
        setShowInputBox(true);
        setIsGDBoxOpen(false);
      }}
      className={`
        w-full flex items-center gap-3
        px-4 py-3 rounded-lg
        text-sm font-medium
        transition-all duration-200
        cursor-pointer
        ${isDarkMode
          ? "text-gray-200 hover:bg-gray-700"
          : "text-gray-700 hover:bg-gray-100"}
      `}
    >
      {/* Icon */}
      <div
        className={` rounded-md${isDarkMode ? "bg-gray-600" : "bg-blue-100"}`}
      >
        <FaFolderPlus className={` ${isNavMinimized ? "text-3xl": "text-2xl"} ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />

      </div>

      {/* Text */}
      {!isNavMinimized && <span>Create folder</span>}
    </button>
  );
}

export default CreateFolder;
