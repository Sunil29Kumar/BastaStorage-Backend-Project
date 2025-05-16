import React, {useContext} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";

function FileProgress() {
  const {
    FileProgress,
    currentFileName,
    setCurrentFileName,
    setFileProgress,
    fileUplodingRemainingTime,
    cancleUpload,
  } = useContext(BastaStorageContext);

  const handleClose = () => {
    setCurrentFileName("");
    setFileProgress(0);
  };

  return (
    <div className="fixed bottom-3 right-9 w-[30vw] bg-blue-50 border border-gray-200 rounded-md shadow-2xl z-50 animate-fade-in transition-all duration-300">
      <div className="p-4">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-gray-800 font-bold ">Uploading 1 item</p>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
            aria-label="Close"
          >
            <i className="ri-close-line font-bold cursor-pointer " />
          </button>
        </div>

        <div className="flex items-start gap-3">
          {/* File Details */}
          <div className="flex flex-col w-[100%] ">
            <div className=" flex items-center gap-2 ">
              {/* File Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <i className="ri-file-line text-blue-500 text-xl" />
              </div>
              <p className=" font-semibold text-gray-700">
                {currentFileName.length > 30
                  ? currentFileName.slice(0, 30) + "...."
                  : currentFileName}
              </p>
            </div>
            {/* Progress Content */}

            <div className="flex flex-col text-gray-500 mt-0.5">
              <p>Time left - {fileUplodingRemainingTime} s</p>
              <div className=" flex justify-between ">
                <span>Uploading... {FileProgress}%</span>
                <button
                  onClick={() => {
                    handleClose;
                    cancleUpload();
                  }}
                  className="hover:text-red-500 cursor-pointer "
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-[100%] bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out"
                style={{width: `${FileProgress}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileProgress;
