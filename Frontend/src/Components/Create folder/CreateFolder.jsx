import { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function CreateFolder() {
  const { isDarkMode,setShowInputBox, setShowFileFolderMenu ,setIsGDBoxOpen} =
    useContext(BastaStorageContext);

  return (
    <div className=" ">
      <button
        onClick={() => {
          setShowInputBox(true);
          setIsGDBoxOpen(false);
        }}
        className={`w-full cursor-pointer flex  items-center gap-2 px-3 py-2   transition ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
      >
        <i className="ri-folder-add-line text-lg text-blue-500"></i>
        <span>Create Folder</span>
      </button>
    </div>
  );
}

export default CreateFolder;
