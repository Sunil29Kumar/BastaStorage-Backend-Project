import React, { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import Folder from "./File Folder List/Folder";
import File from "./File Folder List/File";
import Breadcrumb from "./Breadcrumb";

function Home() {
  const { isDarkMode, filesList, directoriesList } = useContext(BastaStorageContext);



  return (
    <div className=" h-[100%]  ">
      <div className=" overflow-x-auto h-[100%]">
        {/* file folder div  */}

        {(Array.isArray(directoriesList) && directoriesList.length > 0) ||
          (Array.isArray(filesList) && filesList.length > 0) ? (
          <>
            <Folder />
            <File />
          </>
        ) : (
          <div className={` w-[100%] h-full flex justify-center items-center text-[2vw]`}>
            <p className={`   rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "text-gray-800 bg-blue-100"} px-5 py-4 `}>Click + to create Folder or upload Files</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
