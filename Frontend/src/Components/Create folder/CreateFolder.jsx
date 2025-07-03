import {useContext} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";

function CreateFolder() {
  const {setShowInputBox, setShowFileFolderMenu} =
    useContext(BastaStorageContext);

  return (
    <div className=" ">
      <button
        onClick={() => {
          setShowInputBox(true);
        }}
        className="w-full cursor-pointer flex  items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
      >
        <i className="ri-folder-add-line text-lg text-blue-500"></i>
        <span>Create Folder</span>
      </button>
    </div>
  );
}

export default CreateFolder;
