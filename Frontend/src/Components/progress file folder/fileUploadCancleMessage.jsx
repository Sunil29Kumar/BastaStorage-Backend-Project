import React, { useContext, useEffect } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiErrorWarningFill } from "react-icons/ri";

function FileUploadCancleMessage() {
  const {
    isFileUploaded,
    isFileUploadingCancle,
    setIsFileUploaded,
    setIsFileUploadingCancle,
    fileUploadMessage,
    isDarkMode // Assuming this exists for theme matching
  } = useContext(BastaStorageContext);

  useEffect(() => {
    if (isFileUploaded || isFileUploadingCancle || fileUploadMessage.error || fileUploadMessage.message) {
      const time = setTimeout(() => {
        setIsFileUploaded(false);
        setIsFileUploadingCancle(false);
        // Note: Resetting fileUploadMessage should be done in Context if needed
      }, 3000); // 3 seconds is better for reading message

      return () => clearTimeout(time);
    }
  }, [isFileUploaded, isFileUploadingCancle, fileUploadMessage, setIsFileUploaded, setIsFileUploadingCancle]);

  // Helper to render consistent toast style
  const Toast = ({ type, icon, message }) => {
    const styles = {
      success: "border-green-500/20 bg-green-500/10 text-green-500",
      error: "border-red-500/20 bg-red-500/10 text-red-500",
      info: "border-blue-500/20 bg-blue-500/10 text-blue-500"
    };

    return (
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${styles[type]}`}>
        <span className="text-xl">{icon}</span>
        <p className="text-xs font-black uppercase tracking-widest">{message}</p>
      </div>
    );
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-3 w-max max-w-[90vw]">
      
      {/* Success State */}
      {(isFileUploaded || fileUploadMessage.message) && (
        <Toast 
          type="success" 
          icon={<RiCheckboxCircleFill />} 
          message={fileUploadMessage.message || "File uploaded successfully!"} 
        />
      )}

      {/* Cancel State */}
      {isFileUploadingCancle && (
        <Toast 
          type="error" 
          icon={<RiCloseCircleFill />} 
          message="Upload Cancelled" 
        />
      )}

      {/* Error State */}
      {fileUploadMessage.error && (
        <Toast 
          type="error" 
          icon={<RiErrorWarningFill />} 
          message={fileUploadMessage.error} 
        />
      )}
      
    </div>
  );
}

export default FileUploadCancleMessage;