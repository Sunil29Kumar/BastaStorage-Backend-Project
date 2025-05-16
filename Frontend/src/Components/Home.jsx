import React, {useContext} from "react";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";
import Folder from "./File Folder List/Folder";
import File from "./File Folder List/File";

function Home() {
  const {filesList, directoriesList} = useContext(BastaStorageContext);
  return (
    <div className=" h-[100%] ">
      <h3 className=" font-bold text-[1.5vw] text-gray-600  ">
        Welcome to My Drive
      </h3>
      <div className=" overflow-x-auto h-[100%]">
        {/* file folder div  */}

        {(Array.isArray(directoriesList) && directoriesList.length > 0) ||
        (Array.isArray(filesList) && filesList.length > 0) ? (
          <>
            <Folder />
            <File />
          </>
        ) : (
          <div className=" w-[100%] h-full flex justify-center items-center text-[2vw]">
          <p className="  bg-gray-200 rounded-md text-gray-600 px-5 py-4 " >Click + to create Folder or upload Files</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
