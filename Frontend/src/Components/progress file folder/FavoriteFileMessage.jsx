import React, { useContext, useEffect } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { RiStarFill, RiStarLine, RiErrorWarningFill } from "react-icons/ri";

function FavoriteFileMessage() {
  const { 
    favoriteFileMessage, 
    setFavoriteFileMessage // Taaki hum timer ke baad isse reset kar sakein
  } = useContext(BastaStorageContext);

  useEffect(() => {
    // Agar message ya error mein se kuch bhi ho, toh 3 seconds baad hata do
    if (favoriteFileMessage.message || favoriteFileMessage.error) {
      const time = setTimeout(() => {
        setFavoriteFileMessage({ message: "", error: "" });
      }, 3000);

      return () => clearTimeout(time);
    }
  }, [favoriteFileMessage, setFavoriteFileMessage]);

  // Toast Helper Component (Usi design mein)
  const Toast = ({ type, icon, message }) => {
    const styles = {
      // Favorite ke liye hum Gold/Amber color use karenge
      success: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500 shadow-yellow-500/5",
      error: "border-red-500/20 bg-red-500/10 text-red-500 shadow-red-500/5",
    };

    return (
      <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${styles[type]}`}>
        <span className="text-xl animate-bounce-short">{icon}</span>
        <p className="text-xs font-black uppercase tracking-widest">{message}</p>
      </div>
    );
  };

  // Agar dono khali hain toh kuch mat dikhao
  if (!favoriteFileMessage.message && !favoriteFileMessage.error) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-3 w-max max-w-[90vw]">
      
      {/* Success Message (Added to or Removed from Starred) */}
      {favoriteFileMessage.message && (
        <Toast 
          type="success" 
          icon={<RiStarFill />} 
          message={favoriteFileMessage.message} 
        />
      )}

      {/* Error Message */}
      {favoriteFileMessage.error && (
        <Toast 
          type="error" 
          icon={<RiErrorWarningFill />} 
          message={favoriteFileMessage.error} 
        />
      )}
      
    </div>
  );
}

export default FavoriteFileMessage;