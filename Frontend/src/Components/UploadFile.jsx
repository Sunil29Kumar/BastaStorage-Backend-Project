import { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function UploadFile() {
  const { uploadFile, setNewFilename, newFilename, setIsGDBoxOpen, setShowInputBox, isDarkMode } =
    useContext(BastaStorageContext);

  return (
    <div className=" ">
      <label
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer  transition ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
      >
        <i className="ri-upload-cloud-line text-lg text-green-500"></i>
        <input type="file"
          onClick={() => {
            setIsGDBoxOpen(false)
            setShowInputBox(false)
          }}
          onChange={uploadFile} 
          className="hidden" />
        <span>Upload File</span>
      </label>
    </div>
  );
}

export default UploadFile;
