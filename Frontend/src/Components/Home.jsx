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
      className={`w-full h-full px-6 py-5 space-y-6 rounded-t-xl rounded-b-4xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
    >

      <StorageCards />
      <QuickAccess />
      <MyFilesPreview />

    </div>
  );
}

export default Home;
