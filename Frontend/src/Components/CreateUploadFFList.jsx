import { useContext, useEffect, useRef, useMemo } from "react";
import CreateFolder from "./Create folder/CreateFolder";
import UploadFile from "./UploadFile";
import GoogleDrive from "./Google Drive/GoogleDrive";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function CreateUploadFFList() {
  const { setShowFileFolderMenu, isDarkMode, isNavMinimized, windowWidth } =
    useContext(BastaStorageContext);

  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowFileFolderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowFileFolderMenu]);

  // Responsive Positioning Logic
  const menuStyles = useMemo(() => {
    if (windowWidth < 1285 && windowWidth >= 1000) {
      if (isNavMinimized) {
        // Tablet view with minimized nav: Bottom left
        return "absolute left-2 bottom-20 w-[90px]";
      }
      // Mobile view: Bottom center
      return "absolute left-3 bottom-20 w-[260px]";
    }
    else if (windowWidth < 1000) {
      return "absolute left-1 bottom-40 w-[200px]"
    }

    // Desktop view: Beside the sidebar
    return isNavMinimized
      ? "absolute left-5 bottom-20 w-[90px]"
      : "absolute left-4 bottom-20 w-[230px]";
  }, [windowWidth, isNavMinimized]);

  return (
    <>
      <div
        ref={menuRef}
        className={`
          ${menuStyles}
          rounded-2xl shadow-2xl border transition-all duration-300 ease-out animate-in fade-in zoom-in-95
          flex flex-col gap-1 p-2 z-[50]
          ${isDarkMode
            ? "bg-gray-900/95 border-gray-700 text-white"
            : "bg-white border-gray-200 text-black"}
        `}
      >
        {/* Header - Mobile par hamesha dikhayenge better UX ke liye */}
        <div
          className={`px-3 py-2 text-[10px] ${isNavMinimized ? "text-center" : ""}  font-bold uppercase tracking-widest
          ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          Quick Actions
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <CreateFolder />
          <UploadFile />

          {/* Divider */}
          <div className={`my-2 h-px ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`} />

          <GoogleDrive />
        </div>
      </div>
    </>
  );
}

export default CreateUploadFFList;