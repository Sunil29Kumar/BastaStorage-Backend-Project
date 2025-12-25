import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

export const formatBytes = (bytes) => {
  if (bytes >= 1024 ** 4) return (bytes / 1024 ** 4).toFixed(0) + " TB";
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(0) + " GB";
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(0) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
};
function RemainingStorage() {
  const { storageData, isDarkMode } = useContext(BastaStorageContext);

  const used = storageData?.usedSpace || 0;       // in bytes
  const total = storageData?.totalSpace || 1;     // prevent divide by zero

  // Percentage
  const percentUsed = (used / total) * 100;

  // Function: Convert bytes to readable unit


  return (
    <div
      className={`shadow-lg rounded-md p-3 ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-black"
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <i className="ri-cloud-line w-5 h-5 text-blue-600"></i>
        <span className="font-medium">Storage</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-300 rounded-full mb-2 overflow-hidden">
        <div
          className={`h-1.5 ${percentUsed <= 50
            ? "bg-green-500"
            : percentUsed >= 75
              ? "bg-red-500"
              : "bg-blue-500"
            }`}
          style={{ width: `${percentUsed}%` }}
        ></div>
      </div>

      {/* Usage Text */}
      <p className="text-sm mb-2">
        {formatBytes(used)} of {formatBytes(total)} used
      </p>

      <div>
        <Link
          to={"/plans"}
          className="text-blue-400 text-sm font-medium hover:underline"
        >
          View Plans
        </Link>
      </div>
      <div>
        <Link
          to={"/manage-subscription"}
          className="text-orange-400 text-sm font-medium hover:underline"
        >
          Manage Plans
        </Link>
      </div>
    </div>
  );
}

export default RemainingStorage;
