import React, { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function RenameFolderInputBox() {
  const {
    isDarkMode,
    newFilename,
    setNewFilename,
    saveDirectory,
    setShowFolderRenameInputBox,
    isClickOnRenameButton
  } = useContext(BastaStorageContext);

  const renameRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (renameRef.current && !renameRef.current.contains(event.target)) {
        setShowFolderRenameInputBox(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setShowFolderRenameInputBox]);

  return (
    // Backdrop with Blur
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div
        ref={renameRef}
        className={`w-full max-w-[400px] rounded-3xl shadow-2xl border transition-all animate-in zoom-in-95 duration-200 ${
          isDarkMode 
            ? "bg-gray-900 border-gray-700 text-white shadow-black/50" 
            : "bg-white border-gray-100 text-gray-800 shadow-gray-200"
        }`}
      >
        {/* Header Section */}
        <div className="p-6 pb-0 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <i className="ri-folder-settings-line text-amber-500 text-2xl"></i>
            Rename Folder
          </h1>
          <button
            onClick={() => setShowFolderRenameInputBox(false)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={saveDirectory} className="p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold opacity-40 ml-1 tracking-widest">
              Folder Name
            </label>
            <div className="relative">
              <input
                autoFocus
                type="text"
                onChange={(e) => setNewFilename(e.target.value)}
                value={newFilename}
                placeholder="Enter folder name..."
                className={`w-full py-3.5 px-4 pl-11 rounded-xl border-2 transition-all outline-none text-sm font-semibold ${
                  isDarkMode 
                    ? "bg-gray-800/50 border-gray-700 focus:border-amber-500 text-white" 
                    : "bg-gray-50 border-gray-200 focus:border-amber-400 text-black shadow-inner"
                }`}
              />
              <i className="ri-folder-fill absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 opacity-60"></i>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex gap-3 justify-end items-center pt-2">
            <button
              type="button"
              onClick={() => setShowFolderRenameInputBox(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isDarkMode 
                  ? "text-gray-400 hover:bg-gray-800" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 cursor-pointer bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 transition-all"
            >
              {isClickOnRenameButton ? "Updating..." : "Update Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameFolderInputBox;