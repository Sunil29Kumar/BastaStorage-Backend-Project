import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function RemainingStorage() {
  const { storageData,isDarkMode } = useContext(BastaStorageContext);

  // convert bytes -> MB & GB
  const usedMB = storageData?.usedSpace / (1024 * 1024);
  const totalGB = storageData?.totalSpace / (1024 * 1024 * 1024);

  // progress in percentage
  const percentUsed = (usedMB / (totalGB * 1024)) * 100;
  console.log(percentUsed);


  return (
    <div className={` shadow-lg rounded-md p-3  ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-black"}  `}>
      {/* Top Section */}
      <div className="flex items-center gap-2 mb-2">
        <i className="ri-cloud-line w-5 h-5 text-blue-600"></i>
        <span className="font-medium">Storage</span>
      </div>

      {/* Progress Bar */}

      <div className="w-full h-1.5 bg-gray-300 rounded-full mb-2 overflow-hidden">
        <div
          className={`h-1.5 ${percentUsed <= 50 ? "bg-green-500" : percentUsed >= 75 ? "bg-red-500" : "bg-blue-500"
            } rounded-full bg-gray-300`}
          style={{ width: `${percentUsed}%` }}
        ></div>
      </div>


      {/* Usage Info */}
      <p className="text-sm mb-2">
        {usedMB.toFixed(1)} MB of {totalGB.toFixed(1)} GB used
      </p>

      {/* Link */}
      <Link
        to={"/storage-dashboard"}
        className="text-blue-400 text-sm font-medium hover:underline"
      >
        Get more storage
      </Link>
    </div>
  );
}

export default RemainingStorage;
