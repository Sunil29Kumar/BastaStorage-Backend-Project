import {useContext, useEffect, useRef, useState} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";
import {fileFormats} from "../../Utils/FileTypes.jsx";
import {Link, useLocation} from "react-router-dom";

function File() {
  const location = useLocation();
  const {
    directoriesList,
    renameFile,
    setShowFolderRenameInputBox,
    setShowFolderInfo,
    setFolderInfo,
    filesList,
    BASE_URL,
    handleDeleteFile,
    setShowFileRenameInputBox,
    setShowFileInfo,
    setFileInfo,
  } = useContext(BastaStorageContext);

  // use useRef to disable menubar after click on body
  const [openMenueId, setOpenMenueId] = useState(null);
  const [openFolderMenueId, setOpenFolderMenueId] = useState(null);

  // file suggesion
  const [isFileShowing, setIsFileShowing] = useState(false);
  const [fileHeight, setFileHeight] = useState("60vh");

  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenueId(null);
        setOpenFolderMenueId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // get file extension from filename
  const getExtension = (filename) => {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  };
  const getIconByExtension = (extensi) => {
    for (let format of fileFormats) {
      if (format.extensions.includes(extensi)) {
        return format.icon;
      }
    }
    return "file";
  };
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className=" mt-4">
      {/* suggested file  */}
      {location.pathname == "/" && (
        <button
          onClick={() => {
            if (fileHeight == "60vh") {
              setIsFileShowing(true);
              setFileHeight("0vh");
            } else {
              setFileHeight("60vh");
              setIsFileShowing(false);
            }
          }}
          className="  text-[1.3vw]  text-start cursor-pointer px-3 py-1  mb-2  rounded-2xl  hover:bg-blue-300 "
        >
          {" "}
          {isFileShowing ? (
            <i className="ri-arrow-right-s-fill"></i>
          ) : (
            <i className="ri-arrow-down-s-fill"></i>
          )}{" "}
          Suggested File
        </button>
      )}
      <div
        style={{
          height: `${location.pathname === "/my-drive" ? "75vh" : fileHeight}`,
        }}
        className="   overflow-x-hidden    mt-3 "
      >
        {/* files folder data  */}
        <table className="w-[100%] border-collapse z-10 ">
          <thead className="bg-blue-100 text-center ">
            <tr>
              <th className="text-left p-2">Icon</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Created At</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody className=" relative  ">
            {/* directory data --------------------  */}
            {location.pathname == "/my-drive" &&
            directoriesList &&
            directoriesList.length > 0
              ? directoriesList.map((folder) => (
                  <>
                    <tr
                      key={folder.id}
                      className="border-b border-blue-200 hover:bg-blue-50 transition-all "
                    >
                      <td className=" p-2 text-xl">🖿</td>
                      <td className="p-2 cursor-pointer gap-1  ">
                        <Link
                          to={`/directory/${folder.id}`}
                          className=" font-[3vw] flex justify-start gap-3   "
                        >
                          {folder.name.slice(0, 30)}
                        </Link>
                      </td>
                      <td className="p-2">
                        {/* {folder?.folderTimeStamp
                        ? folder.folderTimeStamp?.folderCreatedAt
                            .split(" ")
                            .slice(1, 5)
                            .join(" ")
                        : "liti"} */}
                        fdsf
                      </td>
                      <td className="p-2">-</td>

                      <td className="p-2 relative text-center ">
                        {/* menu bar  */}
                        <button
                          className=" text-lg "
                          onClick={() => setOpenFolderMenueId(folder.id)}
                        >
                          <i className="ri-more-2-fill  cursor-pointer"></i>
                        </button>
                        {/* menu box  */}
                        {openFolderMenueId === folder.id && (
                          <div
                            ref={menuRef}
                            className="absolute  right-[60%] z-30  w-[16VW] px-4 py-4 border border-gray-400 rounded-md bg-white text-black shadow-md flex flex-col gap-3 "
                          >
                            <p className="text-center bg-blue-200 py-2 rounded-2xl  ">
                              {folder.name.length > 10
                                ? folder.name.slice(0, 10)
                                : folder.name}
                            </p>
                            <div
                              onClick={() => {
                                setOpenFolderMenueId(null);
                                renameFile(folder.id, folder.name);
                                setShowFolderRenameInputBox(true);
                              }}
                              className=" cursor-pointer p-2 hover:bg-blue-100 rounded-md flex gap-2  "
                            >
                              <i className="ri-edit-2-line"></i>
                              Rename
                            </div>
                            <div
                              // onClick={() => {}}
                              className=" cursor-pointer p-2 hover:bg-blue-100 rounded-md flex gap-2  "
                            >
                              <i className="ri-delete-bin-fill"></i>
                              Delete
                            </div>
                            <div
                              onClick={() => {
                                setShowFolderInfo(true);
                                setOpenFolderMenueId(null);
                                setFolderInfo([
                                  {
                                    folderId: folder.id,
                                    folderName: folder.name,
                                    folderSize: null,
                                  },
                                ]);
                              }}
                              className=" cursor-pointer p-2 hover:bg-blue-100 rounded-md flex gap-2 "
                            >
                              <i className="ri-edit-2-line"></i>
                              Folder Information
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </>
                ))
              : !filesList.length > 0 &&
                !directoriesList.length > 0 &&
                location.pathname == "/my-drive" && (
                  <div className=" absolute  w-[100%] h-[50vh]  flex justify-center items-center  ">
                    <p className=" bg-gray-200 rounded-md text-gray-600 text-[2vw] px-7 py-4  ">
                      click + to add Folders
                    </p>
                  </div>
                )}

            {/* file data ------------------------- */}
            {filesList && filesList.length > 0
              ? filesList.map((file) => {
                  const extensi = getExtension(file.name);
                  const icon = getIconByExtension(extensi);

                  return (
                    <>
                      <tr
                        key={file.id}
                        className="border-b border-blue-200 hover:bg-blue-50 transition-all "
                      >
                        <td className="p-2 text-xl">{icon}</td>
                        <td className="p-2 cursor-pointer flex flex-col gap-1  ">
                          <a href={`${BASE_URL}/file/${file.id}`} className=" ">
                            {file.name.length > 45
                              ? file.name.slice(0, 45) + "..."
                              : file.name}
                          </a>
                        </td>
                        <td className="p-2">
                          {file.timeStamp.fileCreatedAt
                            .split(" ")
                            .slice(1, 5)
                            .join(" ")}
                        </td>
                        <td className="p-2">{formatSize(file.size)}</td>

                        <td className="p-2 relative text-center ">
                          {/* menu bar  */}
                          <button
                            className="text-lg"
                            onClick={() => setOpenMenueId(file.id)}
                          >
                            <i className="ri-more-2-fill cursor-pointer"></i>
                          </button>
                          {/* menu box  */}

                          {openMenueId === file.id && (
                            <div
                              ref={menuRef}
                              className={`${
                                location.pathname == "/my-drive"
                                  ? "absolute z-[999] right-[56%] bottom-[12%] "
                                  : "fixed top-[50%] right-[7%] "
                              }  w-[16VW] px-4 py-4 border border-gray-400 rounded-md bg-white text-black shadow-md flex flex-col gap-3 `}
                            >
                              <p className=" text-center bg-blue-200 py-2 rounded-2xl ">
                                {file.name.length > 15
                                  ? file.name.slice(0, 15) + "..."
                                  : file.name}
                              </p>
                              <div
                                onClick={() => {
                                  renameFile(file.id, file.name);
                                  setShowFileRenameInputBox(true);
                                  setOpenMenueId(null);
                                }}
                                className="cursor-pointer rounded-md flex items-center gap-2 p-1 hover:bg-blue-100"
                              >
                                <i className="ri-edit-2-line"></i>
                                Rename
                              </div>
                              <div
                                onClick={() => {
                                  handleDeleteFile(file.id);
                                  setOpenMenueId(null);
                                }}
                                className="cursor-pointer rounded-md flex items-center gap-2 p-1 hover:bg-blue-100"
                              >
                                <i className="ri-delete-bin-fill"></i>
                                Delete
                              </div>
                              <a
                                onClick={() => setOpenMenueId(null)}
                                href={`${BASE_URL}/file/${file.id}?action=download`}
                                className="flex items-center gap-2  rounded-md p-1 hover:bg-blue-100"
                              >
                                <i className="ri-download-2-fill"></i>
                                Download
                              </a>
                              <div
                                onClick={() => {
                                  setShowFileInfo(true);
                                  setOpenMenueId(null);
                                  setFileInfo([
                                    {
                                      fileId: file.id,
                                      icon: icon,
                                      fileName: file.name,
                                      fileSize: file.size,
                                      fileCreationDate:
                                        file.timeStamp.fileCreatedAt,
                                      // fileOpenDate: file.timeStamp.opened,
                                      fileModifiedDate:
                                        file.timeStamp.lastModified,
                                      // fileDownloadDate: file.timeStamp.lastDownload,
                                    },
                                  ]);
                                }}
                                className="cursor-pointer rounded-md flex items-center gap-2 p-1 hover:bg-blue-100"
                              >
                                <i className="ri-file-info-line"></i>
                                File information
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    </>
                  );
                })
              : location.pathname != "/my-drive" && (
                  <p className="text-center text-gray-500">
                    click + to add new file
                  </p>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default File;
