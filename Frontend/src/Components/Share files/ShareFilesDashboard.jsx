import React, { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function ShareFilesDashboard() {
  const { isDarkMode, setShowShareFile, shareLink, shareFileId,shareFileUrl } = useContext(BastaStorageContext);


  const containerRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowShareFile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={` absolute left-0 top-0 w-full h-full flex items-center rounded-md justify-center    ${isDarkMode ? "bg-black/40" : "bg-black/30"}  `}>

      <div
        ref={containerRef}
        className={`w-[40%] rounded-md shadow-lg p-6 space-y-6 ${isDarkMode ? "bg-gray-800" : "bg-white"} `}>
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Share File</h2>

        {/* Private Share */}
        <div>
          <p className="mb-2 font-medium">Invite people</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter email"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600">
              Add
            </button>
          </div>

          {/* Example invited list */}
          <div className="mt-3 space-y-2">
            <div className={`flex justify-between items-center  rounded-lg p-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <span>example@mail.com</span>
              <select className="border rounded px-2 py-1 text-sm">
                <option value="view">Viewer</option>
                <option value="edit">Editor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Public Link */}
        <div>
          <p className="mb-2 font-medium">Get shareable link</p>
          <button
            onClick={() => {
              shareLink(shareFileId)
              console.log(shareFileId);
            }}
            className=" p-2 bg-black text-white rounded-md cursor-pointer " >Get link</button>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareFileUrl}
              readOnly
              className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            />
            <button className={`px-3 py-2 cursor-pointer border rounded-lg hover:bg-gray-100 ${isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white"}`}>
              <i className="ri-file-copy-line text-lg"></i>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div
          onClick={() => setShowShareFile(false)}
          className="flex justify-end gap-3">
          <button className={`px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer ${isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white"}`}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareFilesDashboard;
