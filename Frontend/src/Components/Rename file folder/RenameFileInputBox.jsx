import React, { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function RenameFileInputBox() {
  const {
    isDarkMode,
    newFilename,
    setNewFilename,
    saveFilename,
    setShowFileRenameInputBox,
    isClickOnRenameButton
  } = useContext(BastaStorageContext);

  const renameRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (renameRef.current && !renameRef.current.contains(event.target)) {
        setShowFileRenameInputBox(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setShowFileRenameInputBox]);

  return (
    // Backdrop Blur Overlay
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
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <i className="ri-edit-circle-line text-blue-500 text-2xl"></i>
            Rename File
          </h1>
          <button
            onClick={() => setShowFileRenameInputBox(false)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <i className="ri-close-line text-xl opacity-60"></i>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={saveFilename} className="p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold opacity-40 ml-1 tracking-widest">
              New Filename
            </label>
            <input
              autoFocus
              type="text"
              onChange={(e) => setNewFilename(e.target.value)}
              value={newFilename}
              placeholder="Enter new name..."
              className={`w-full py-3 px-4 rounded-xl border-2 transition-all outline-none text-sm font-medium ${
                isDarkMode 
                  ? "bg-gray-800/50 border-gray-700 focus:border-blue-500 text-white" 
                  : "bg-gray-50 border-gray-200 focus:border-blue-400 text-black"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end items-center pt-2">
            <button
              type="button"
              onClick={() => setShowFileRenameInputBox(false)}
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
              className="px-6 py-2.5 cursor-pointer bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all"
            >
              {isClickOnRenameButton ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameFileInputBox;