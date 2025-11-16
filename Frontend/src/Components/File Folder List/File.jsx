import { useContext, useEffect, useRef, useState } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { fileFormats } from "../../Utils/FileTypes.jsx";
import { Link, useLocation } from "react-router-dom";
import { formatSize } from "../../Utils/formatSize.js";

function File() {
  const location = useLocation();
  const {
    isDarkMode,
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
    setShowShareFile,
    setShareFileId,
    shareLink,
    setIsShareLinkCopied
  } = useContext(BastaStorageContext);

  // use useRef to disable menubar after click on body
  const [openMenueId, setOpenMenueId] = useState(null);
  const [openFolderMenueId, setOpenFolderMenueId] = useState(null);

  // file suggesion
  const [isFileShowing, setIsFileShowing] = useState(false);
  const [fileHeight, setFileHeight] = useState("60vh");

  // menu box position
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // hover share file
  const [isShareFileHover, setIsShareFileHover] = useState(false);

  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenueId(null);
        setOpenFolderMenueId(null);
        setIsShareFileHover(false)
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

  const handleMenuToggle = (e) => {
    const y = e.clientY - 300;
    setMenuPosition({ y });
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
          className={` text-[1.3vw]  text-start cursor-pointer px-3 py-1  rounded-2xl  ${isDarkMode ? "text-gray-100 hover:bg-gray-800 " : " text-black hover:bg-blue-300"} `}
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
        className="   overflow-x-hidden  mt-3 "
      >
        {/* files folder data  */}
        <table className="w-[100%] border-collapse z-10 ">
          <thead className={`text-center ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-blue-100 text-black"}`}>
            <tr>
              <th className="text-left p-2">Icon</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Created At</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody className=" relative  ">

            {/* directory data -----------------------------------------------  */}

            {location.pathname == "/my-drive" &&
              directoriesList &&
              directoriesList.length > 0
              ? directoriesList.map((folder) => (
                <>
                  <tr
                    key={folder.id}
                    className={`border-b transition duration-300 ease-in  ${isDarkMode ? " border-gray-800 hover:bg-gray-800 " : " border-blue-200 hover:bg-blue-100"}`}
                  >
                    {/* icon  */}
                    <td className=" p-2 text-xl">🖿</td>
                    {/* name  */}
                    <td className="p-2 cursor-pointer gap-1  ">
                      <Link
                        to={`/directory/${folder.id}`}
                        className=" font-[3vw] flex justify-start gap-3   "
                      >
                        {folder.name.slice(0, 30)}
                      </Link>
                    </td>
                    {/* timestamp  */}
                    <td className="p-2">
                      {folder.folderTimeStamp?.folderCreatedAt.split("T")[0]}
                      {/* fdsf */}
                    </td>
                    {/* size  */}
                    <td className="p-2">{formatSize(folder.size)}</td>

                    {/* ------------- menu bar Section  */}
                    <td className="p-2 relative text-center ">
                      <button
                        className=" text-lg "
                        onClick={(e) => {
                          setOpenFolderMenueId(folder.id)
                          handleMenuToggle(e)
                        }}
                      >
                        <i className="ri-more-2-fill  cursor-pointer"></i>
                      </button>
                      {/* DIRECTORY menu button  */}
                      {openFolderMenueId === folder.id && (
                        <div
                          ref={menuRef}
                          className={`fixed right-[8%]
                               w-[16VW] px-4 py-4 border border-gray-400 rounded-md  shadow-md flex flex-col gap-3 z-[100] ${isDarkMode ? "bg-gray-900  text-gray-100" : "bg-white text-black"}`}
                          style={{ top: menuPosition.y + 60 }}
                        >
                          <p className={`text-center  py-2 rounded-2xl ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-blue-200"}  `}>
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
                            className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"} `}
                          >
                            <i className="ri-edit-2-line"></i>
                            Rename
                          </div>
                          <div
                            // onClick={() => {}}
                            className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"} `}
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
                                  folderSize: formatSize(folder.size),
                                  folderCreationDate: folder.folderTimeStamp.folderCreatedAt,
                                  folderOpendedDate: folder.folderTimeStamp.opened,
                                  folderLastModified:
                                    folder.folderTimeStamp.lastModified,
                                },
                              ]);
                            }}
                            className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"} `}
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


            {/* file data ----------------------------------------------------- */}

            {filesList && filesList.length > 0
              ? filesList.map((file) => {
                const extensi = getExtension(file.name);
                const icon = getIconByExtension(extensi);

                return (
                  <>
                    <tr
                      key={file.id}
                      className={`border-b  transition duration-300 ease-in   ${isDarkMode ? " border-gray-800 hover:bg-gray-800 " : " border-blue-200 hover:bg-blue-100  "}`}
                    >
                      {/* file icon  */}
                      <td className="p-2 text-2xl">{icon}</td>
                      {/* file name  */}
                      <td className="p-2 cursor-pointer flex flex-col gap-1  ">
                        {/* <a href={file.URL?file.URL :`${BASE_URL}/file/${file.id}`} className=" "> */}
                        <a href={`${BASE_URL}/file/${file.id}`} className=" ">
                          {file.name.length > 45
                            ? file.name.slice(0, 45) + "..."
                            : file.name}
                        </a>
                      </td>
                      {/* file created at  */}
                      <td className="p-2">
                        {file.timeStamp.fileCreatedAt.split("T")[0]}
                      </td>
                      {/* file size  */}
                      <td className="p-2">{formatSize(file.size)}</td>

                      {/* ----------------- menu section */}
                      <td className="p-2 relative text-center ">

                        {/* menu bar  */}
                        <button
                          className="text-lg z-[10]"
                          onClick={(e) => {
                            setOpenMenueId(file.id)
                            handleMenuToggle(e)
                          }}
                        >
                          <i className="ri-more-2-fill cursor-pointer"></i>
                        </button>

                        {/* menu box  */}
                        {openMenueId === file.id && (
                          <div
                            ref={menuRef}
                            className={`fixed right-[8%]
                               w-[16VW] px-4 py-4 border border-gray-400 rounded-md shadow-md flex flex-col gap-3 z-[100] ${isDarkMode ? "bg-gray-900 text-white" : " bg-white text-black"}`}
                            style={{ top: menuPosition.y }}
                          >
                            <p
                              className={`text-center  py-2 rounded-2xl ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-blue-200"} `}>
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
                              className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"}`}
                            >
                              <i className="ri-edit-2-line"></i>
                              Rename
                            </div>
                            {/* delete  */}
                            <div
                              onClick={() => {
                                handleDeleteFile(file.id);
                                setOpenMenueId(null);
                              }}
                              className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"}`}
                            >
                              <i className="ri-delete-bin-fill"></i>
                              Delete
                            </div>
                            {/* download  */}
                            <a
                              onClick={() => setOpenMenueId(null)}
                              href={`${BASE_URL}/file/${file.id}?action=download`}
                              className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"}`}
                            >
                              <i className="ri-download-2-fill"></i>
                              Download
                            </a>
                            {/* file info  */}
                            <div
                              onClick={() => {
                                setShowFileInfo(true);
                                setOpenMenueId(null);
                                setFileInfo([
                                  {
                                    fileId: file.id,
                                    icon: icon,
                                    fileName: file.name,
                                    fileSize: formatSize(file.size),
                                    fileCreationDate:
                                      file.timeStamp.fileCreatedAt,
                                    fileOpenDate: file.timeStamp.opened,
                                    fileModifiedDate:
                                      file.timeStamp.lastModified,
                                    fileDownloadDate: file.timeStamp.lastDownload,
                                  },
                                ]);
                              }}
                              className={` cursor-pointer p-2  rounded-md flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100"}`}
                            >
                              <i className="ri-file-info-line"></i>
                              File information
                            </div>


                            {/*-------- share file  */}
                            <div
                              onClick={() => setIsShareFileHover(true)}
                              className={` relative cursor-pointer rounded-md flex items-center justify-between gap-2 p-2 ${isDarkMode ? "hover:bg-gray-700" : " hover:bg-blue-100 "}`}
                            >
                              <div className="flex items-center gap-2">
                                <i className="ri-share-line"></i>
                                share file
                              </div>
                              <i className="ri-arrow-right-s-line"></i>
                            </div>
                            {isShareFileHover && (
                              <div
                                onMouseLeave={() => setIsShareFileHover(false)}
                                className={`absolute z-[100] right-[100%] bottom-0 w-[10vw]  border-2  rounded-md flex flex-col  gap-2 p-2 ${isDarkMode ? " bg-gray-800 border-gray-600" : "bg-white border-blue-200"} `}>

                                {/* share button  */}
                                <button
                                  onClick={() => {
                                    setShowShareFile(true)
                                    setOpenMenueId(null);
                                    setShareFileId(file.id);
                                    setIsShareFileHover(false)

                                  }}
                                  className={` relative w-full cursor-pointer rounded-md  p-1 hover:bg-blue-100 flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : ""}`} ><i className="ri-user-add-line"></i> Share</button>

                                {/* copy link button  */}
                                <button
                                  onClick={() => {
                                    shareLink(file.id);
                                    setIsShareFileHover(false);
                                    setOpenMenueId(null);
                                    setIsShareLinkCopied(true)
                                    setTimeout(() => {
                                      setIsShareLinkCopied(false)
                                    }, 1500);
                                  }}
                                  className={` relative w-full cursor-pointer rounded-md  p-1 hover:bg-blue-100 flex gap-2 ${isDarkMode ? "hover:bg-gray-700" : ""}`}>
                                  <i className="ri-link-m"></i>
                                  Copy Link
                                </button>
                              </div>

                            )}
                          </div>
                        )}

                      </td>
                    </tr>
                  </>
                );
              })
              : location.pathname != "/my-drive" && (
                <p className={`text-center ${isDarkMode ? "bg-gray-800" : "bg-white"} text-gray-500`}>
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
