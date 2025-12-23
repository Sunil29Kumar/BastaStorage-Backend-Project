import { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function Logout() {
  const { isDarkMode, setShowLogOutBox, handleLogout, logoutFromAllDevice } =
    useContext(BastaStorageContext);

  const logoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutRef.current && !logoutRef.current.contains(event.target))
        setShowLogOutBox(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowLogOutBox]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Card */}
      <div 
        ref={logoutRef}
        className={`w-full max-w-[400px] mx-4 rounded-[2.5rem] p-8 shadow-2xl transform animate-in zoom-in-95 duration-300 ${
          isDarkMode 
          ? "bg-[#1c1f23] border border-white/10 text-white" 
          : "bg-white text-gray-800"
        }`}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-red-500/10" : "bg-red-50"
          }`}>
            <i className="ri-error-warning-fill text-4xl text-red-500"></i>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Logging Out?
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">
            Choose if you want to sign out from this device only or all active sessions.
          </p>
        </div>

        {/* Buttons Stack */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setShowLogOutBox(false);
              logoutFromAllDevice();
            }}
            className="w-full py-4 cursor-pointer rounded-[1.3rem] bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/20"
          >
            Logout All Devices
          </button>

          <button
            onClick={() => {
              setShowLogOutBox(false);
              handleLogout();
            }}
            className={`w-full py-4 cursor-pointer rounded-[1.3rem] text-xs font-black uppercase tracking-widest transition-all active:scale-95 border ${
              isDarkMode 
              ? "border-white/10 hover:bg-white/5 text-white" 
              : "border-gray-100 hover:bg-gray-50 text-gray-600"
            }`}
          >
            This Device Only
          </button>

          <button
            onClick={() => setShowLogOutBox(false)}
            className={`w-full py-4 cursor-pointer text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity`}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;