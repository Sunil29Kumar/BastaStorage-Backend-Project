import {useContext, useEffect, useRef, useState} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";
import {Link} from "react-router-dom";
import {use} from "react";

function Folder() {
  const {
    directoriesList,
    renameFile,
    handleDeleteDirectory,
    showFolderRenameInputBox,
    setShowFolderRenameInputBox,
    setShowFolderInfo,
    setFolderInfo,
    setCurrentFolderName,
  } = useContext(BastaStorageContext);

  const [isFolderShowing, setIsFolderShowing] = useState(true);
  const [folderHeight, setFolderHeight] = useState("0vh");
  const [folderOverFlow, setFolderOverFlow] = useState("hidden");

  // use useRef to disable menubar after click on body
  const [openFolderMenueId, setOpenFolderMenueId] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setOpenFolderMenueId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="  ">
      {/* folders  */}
      <button
        onClick={() => {
          if (folderHeight == "30vh") {
            setIsFolderShowing(true);
            setFolderOverFlow("hidden");
            setFolderHeight("0vh");
          } else {
            setFolderHeight("30vh");
            setIsFolderShowing(false);
            setFolderOverFlow("visible");
          }
        }}
        className="  text-[1.3vw]  text-start cursor-pointer px-3 py-1  rounded-2xl  hover:bg-blue-300 "
      >
        {" "}
        {isFolderShowing ? (
          <i className="ri-arrow-right-s-fill"></i>
        ) : (
          <i className="ri-arrow-down-s-fill"></i>
        )}{" "}
        Suggested Folder
      </button>
      {/* folder div  */}
      <div
        style={{maxHeight: `${folderHeight}`, overflow: `${folderOverFlow}`}}
        className="   "
      >
        {/* folder data  */}
        <div className=" h-[100%] flex flex-wrap justify-start items-start  gap-4 mt-3  ">
          {directoriesList && directoriesList.length > 0 ? (
            directoriesList.map((folder, index) => (
              <div
                key={folder.id}
                className=" flex justify-between w-[25vw] px-3 py-2 items-center bg-blue-50  cursor-pointer hover:bg-blue-100  transition duration-300 ease-in "
              >
                <Link
                  to={`/directory/${folder.id}`}
                  className=" font-[3vw] flex gap-3 justify-center items-center  "
                >
                  <div className=" text-[2vw] ">🖿</div>
                  <div className="hover:text-[1.5vw]">
                    {folder.name.slice(0, 10)}
                  </div>
                </Link>
                {/* menu button  */}
                <div className=" relative ">
                  <button
                    className=" cursor-pointer "
                    onClick={() => setOpenFolderMenueId(folder.id)}
                  >
                    <i className="ri-more-2-fill"></i>
                  </button>
                  {/* menu box  */}
                  {openFolderMenueId === folder.id && (
                    <div
                      ref={menuRef}
                      className="absolute  right-0 z-30  w-[16VW] px-4 py-4 border border-gray-400 rounded-md bg-white text-black shadow-md flex flex-col gap-3 "
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
                        onClick={() => handleDeleteDirectory(folder.id)}
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
                </div>
              </div>
            ))
          ) : (
            <div className=" w-[100%] flex justify-center " >
            <p className=" bg-gray-200 rounded-md text-gray-600 px-7 py-4  ">click + to add Folders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Folder;
