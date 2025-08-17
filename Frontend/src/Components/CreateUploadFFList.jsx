import React, { useContext, useEffect, useRef, useState } from "react";
import CreateFolder from "./Create folder/CreateFolder";
import UploadFile from "./UploadFile";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import GoogleDriveFiles from "./Google Drive/GoogleDrive";
import GoogleDriveFilesFolderList from "./Google Drive/GoogleDriveLayout";
import GoogleDrive from "./Google Drive/GoogleDrive";

function CreateUploadFFList() {
  const { setShowFileFolderMenu } = useContext(BastaStorageContext);
  const fileFolderMenuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        fileFolderMenuRef.current &&
        !fileFolderMenuRef.current.contains(event.target)
      )
        setShowFileFolderMenu(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={fileFolderMenuRef}
      className="absolute bottom-[0%] left-[1%] w-[15vw] border-1 bg-white border-blue-400 shadow-lg rounded-md flex flex-col p-2  "
    >
      <CreateFolder />
      <UploadFile />
      <GoogleDrive />

    </div>
  );
}

export default CreateUploadFFList;
