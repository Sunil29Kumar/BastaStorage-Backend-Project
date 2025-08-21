import React, {useContext, useEffect} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";

function FileUploadCancleMessage() {
  const {
    isFileUploaded,
    isFileUploadingCancle,
    setIsFileUploaded,
    setIsFileUploadingCancle,
  } = useContext(BastaStorageContext);

  useEffect(() => {
    if (isFileUploaded || isFileUploadingCancle) {
      const time = setTimeout(() => {
        setIsFileUploaded(false);
        setIsFileUploadingCancle(false);
      }, 1500);

      return ()=> clearTimeout(time)
    }
  }, [
    isFileUploaded,
    isFileUploadingCancle,
    setIsFileUploaded,
    setIsFileUploadingCancle,
  ]);

  return (
    <div className="absolute bottom-[3%] left-[50%] translate-x-[-50%]  top() z-50 space-y-2">
      {isFileUploaded && (
        <div className="px-4 py-3 rounded-xl bg-green-100 text-green-800 shadow-md animate-fade-in-out">
          ✅ File uploaded successfully!
        </div>
      )}
      {isFileUploadingCancle && (
        <div className="px-4 py-3 rounded-xl bg-red-100 text-red-800 shadow-md animate-fade-in-out">
          ❌ File Upload cancelled!
        </div>
      )}
    </div>
  );
}

export default FileUploadCancleMessage;
