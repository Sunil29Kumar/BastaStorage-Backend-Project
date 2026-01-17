import React, { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import Breadcrumb from "./Breadcrumb";
import StorageCards from "./File Folder List/StorageCards";
import QuickAccess from "./File Folder List/QuickAccess";
import MyFilesPreview from "./File Folder List/MyFilesPreview";
import StorageOverview from "./Total Storage/StorageOverview ";

function Home() {
  const { isDarkMode, filesList, directoriesList } = useContext(BastaStorageContext);



  return (
    <div
      className={`w-full h-full overflow-x-auto px-2 py-5 space-y-5 rounded-t-xl rounded-b-4xl ${isDarkMode ? "bg-gray-800 text-white" : " text-gray-900"
        }
        [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-blue-400
              [&::-webkit-scrollbar-thumb]:rounded-full
        `}
    >

      <StorageCards />
      <QuickAccess />
      <MyFilesPreview />

    </div>
  );
}

export default Home;
