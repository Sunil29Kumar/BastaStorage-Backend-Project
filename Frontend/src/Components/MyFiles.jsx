import React, { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import Breadcrumb from './Breadcrumb'
import Folder from "./File Folder List/Folder";
import File from "./File Folder List/File";



function MyFiles() {
  const { isDarkMode, filesList, directoriesList } = useContext(BastaStorageContext);

  return (
    <div className=" rounded-md h-[90vh] px-2   rounded-b-4xl overflow-x-hidden  
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-blue-400
              [&::-webkit-scrollbar-thumb]:rounded-full 
              ">
      {/* Breadcrumb */}
      <Breadcrumb currentComp="My Files" />

      <Folder />
      <File />

    </div>
  );
}


export default MyFiles