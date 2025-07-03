import {useContext} from "react";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";

function UploadFile() {
  const {uploadFile, setNewFilename, newFilename} =
    useContext(BastaStorageContext);

  return (
    <div className=" ">
      {/* <label className="inline-flex items-center text-white cursor-pointer rounded-md px-2 py-1 bg-blue-500 hover:bg-blue-700 transition ">
        <i className="ri-upload-cloud-fill"></i>
        <input type="file" onChange={uploadFile} className="hidden" />
      </label> */}

      <label
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
      >
        <i className="ri-upload-cloud-line text-lg text-green-500"></i>
        <input type="file" onChange={uploadFile} className="hidden" />
        <span>Upload File</span>
      </label>
    </div>
  );
}

export default UploadFile;
