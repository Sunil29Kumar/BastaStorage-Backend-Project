import { useContext, useEffect, useRef } from "react";
import CreateFolder from "./Create folder/CreateFolder";
import UploadFile from "./UploadFile";
import GoogleDrive from "./Google Drive/GoogleDrive";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function CreateUploadFFList() {
  const { setShowFileFolderMenu, isDarkMode, isNavMinimized } =
    useContext(BastaStorageContext);

  const menuRef = useRef(null);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowFileFolderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className={`
        absolute bottom-14 
        ${isNavMinimized ? "w-[5vw] left-2" : "w-[15vw] left-3"}
        rounded-xl shadow-xl
        border
        backdrop-blur-md
        flex flex-col gap-1
        p-2
        z-50
        ${isDarkMode
          ? "bg-gray-900/95 border-gray-700"
          : "bg-gray-200 border-gray-200"}
      `}
    >
      {/* Header */}
      {
        !isNavMinimized && <div
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide
          ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}
        >
          Create / Upload
        </div>
      }


      {/* Actions */}
      <CreateFolder />
      <UploadFile />

      {/* Divider */}
      <div
        className={`my-1 h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-400"
          }`}
      />

      <GoogleDrive />
    </div>
  );
}

export default CreateUploadFFList;
