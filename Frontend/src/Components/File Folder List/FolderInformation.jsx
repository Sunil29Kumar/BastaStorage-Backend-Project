import React, { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function FolderInformation() {
  const { isDarkMode, setShowFolderInfo, folderInfo } = useContext(BastaStorageContext);

  const infoRef = useRef(null);

  useEffect(() => {
    console.log(folderInfo);
    
    function handleClickOutSide(event) {
      if (infoRef.current && !infoRef.current.contains(event.target))
        setShowFolderInfo(false);
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [setShowFolderInfo]);

  return (
    <div
      ref={infoRef}
      className={`absolute right-[2%] bottom-[0%] z-50 w-[30vw] h-[80vh] rounded-xl shadow-xl p-5 overflow-auto ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white  border-gray-300"}`}
    >
      {folderInfo.length > 0 && (
        <div className="">
          <div
            className={`flex relative justify-between items-center w-full mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            <h2 className="text-lg font-semibold  flex gap-2 ">
              <p>{"🗂️"}</p>
              {folderInfo[0].folderName.length > 20
                ? folderInfo[0].folderName.slice(0, 20) + "..."
                : folderInfo[0].folderName}
            </h2>
            <button
              onClick={() => setShowFolderInfo(false)}
              className="cursor-pointer hover:text-red-500 transition-colors absolute right-[5%] top-[0%] m-2"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* table  */}
          <table className="table-auto w-full text-sm">
            <tbody>
              {/* FOLDER ID  */}
              <tr className=" border-blue-200">
                <td className="pt-2 font-semibold">Folder ID:</td>
              </tr>

              <tr className="  border-blue-200">
                <td className="py-1">{folderInfo[0].folderId}</td>
              </tr>
              {/* folder name  */}
              <tr className=" border-blue-200">
                <td className="pt-2 font-semibold">Folder Name: </td>
              </tr>
              <tr className=" border-blue-200">
                <td className="py-1">{folderInfo[0].folderName}</td>
              </tr>
              {/* folder size  */}
              <tr className=" border-blue-200">
                <td className="pt-2 font-semibold">Folder Size:</td>
              </tr>
              <tr className=" border-blue-200">
                <td className="py-1">{folderInfo[0].folderSize}</td>
              </tr>
              {/* folder created at  */}
              <tr className=" border-blue-200">
                <td className="pt-2 font-semibold">Created At:</td>
              </tr>
              <tr className=" border-blue-200">
                <td className="py-1">{folderInfo[0].folderCreationDate}</td>
              </tr>

              {/* file opened date  */}

              <tr className=" border-blue-200">
                <td className="pt-2 font-semibold">Opened:</td>
              </tr>
              <tr className=" border-blue-200">
                <td className="py-1 text-[1vw] font-normal">
                  {folderInfo[0].folderOpendedDate?.length > 0
                    ? folderInfo[0].folderOpendedDate.map((data, i) => (
                        <div key={i}>{data}</div>
                      ))
                    : "N/A"}
                </td>
              </tr>

              {/* last modified date  */}

              <tr className=" border-blue-200">
                <td className="pt-2 font-semibold">Last Modified:</td>
              </tr>
              <tr className=" border-blue-200">
                <td className="py-1 text-[1vw] font-normal">
                  {folderInfo[0].folderModifiedDate?.length > 0
                    ? folderInfo[0].folderModifiedDate.map((data, i) => (
                        <div key={i}>{data}</div>
                      ))
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FolderInformation;
