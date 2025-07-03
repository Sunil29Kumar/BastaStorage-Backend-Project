import {useContext, useEffect, useRef} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";

function RenameFolderInputBox() {
  const {
    newFilename,
    setNewFilename,
    saveDirectory,
    setShowFolderRenameInputBox,
  } = useContext(BastaStorageContext);

  const renameReff = useRef(null);

  useEffect(() => {
    const handFolderleInputBoxClick = (event) => {
      if (renameReff.current && !renameReff.current.contains(event.target))
        setShowFolderRenameInputBox(false);
    };
    document.addEventListener("mousedown", handFolderleInputBoxClick);
    return () => {
      document.removeEventListener("mousedown", handFolderleInputBoxClick);
    };
  }, [setShowFolderRenameInputBox]);

  return (
    <div
    ref={renameReff}
     className=" w-[30vw] rounded-md border-2 border-blue-200 bg-gray-100 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-5 flex flex-col gap-5 ">
      <div className=" flex justify-between ">
        <h1 className=" text-[2vw] ">Rename Folder</h1>
        <button
          onClick={() => setShowFolderRenameInputBox(false)}
          className=" cursor-pointer "
        >
          <i className="ri-close-large-line"></i>
        </button>
      </div>
      {/* FORM  */}
      <form onSubmit={saveDirectory} className=" flex gap-5 flex-col ">
        <div>
          <input
            type="text"
            className=" border-2 border-black w-[100%] py-2 px-1 "
            onChange={(e) => setNewFilename(e.target.value)}
            value={newFilename}
          />
        </div>
        <div className=" flex gap-5 justify-end ">
          <button
            onClick={() => setShowFolderRenameInputBox(false)}
            className=" cursor-pointer text-blue-400 "
          >
            Cancle
          </button>
          <input
            type="submit"
            className=" cursor-pointer bg-blue-500 py-1 px-3 rounded-md"
            value={"save"}
          />
        </div>
      </form>
    </div>
  );
}

export default RenameFolderInputBox;
