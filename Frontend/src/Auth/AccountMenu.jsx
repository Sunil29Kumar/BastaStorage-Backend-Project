import { useContext, useEffect, useRef } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import TermsPrivacyFooter from "../Components/legal/TermsPrivacyFooter.jsx";


function AccountMenu() {
  const {
    isDarkMode,
    setAccountMenu,
    setShowLogOutBox,
    storeUserData,
    setIsManageProfileShowing,
  } = useContext(BastaStorageContext);

  const accoutnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accoutnRef.current && !accoutnRef.current.contains(event.target))
        setAccountMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setAccountMenu]);


  return (
    <div
      ref={accoutnRef}
      className={`absolute z-[999] right-6 top-20 min-w-[25vw] rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 transition-all ${isDarkMode
        ? "bg-gray-700 backdrop-blur-xl border border-white/10 text-white"
        : "bg-white/95 backdrop-blur-xl border border-gray-100 text-gray-800"
        }`}
    >
      {storeUserData && (
        <div className="flex flex-col items-center">
          {/* USER IMAGE SECTION */}
          <div className="relative group mb-4">
            <div className={`w-24 h-24 rounded-full p-1 border-2 border-dashed ${isDarkMode ? "border-blue-500/50" : "border-blue-400"}`}>
              <div className="w-full h-full rounded-full overflow-hidden shadow-inner ring-4 ring-transparent group-hover:ring-blue-500/20 transition-all">
                <img
                  src={storeUserData.picture ? storeUserData.picture : "/user-img.png"}
                  className="w-full h-full object-cover"
                  alt="profile"
                />
              </div>
            </div>
            {/* Status Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#1c1f23] rounded-full shadow-lg"></div>
          </div>

          {/* USER DETAILS */}
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-xl font-black tracking-tight leading-tight">
              {storeUserData.name}
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">
              {storeUserData.email}
            </p>
          </div>

          {/* ACTIONS SECTION */}
          <div className="w-full space-y-3">
            <button
              onClick={() => {
                setIsManageProfileShowing(true);
                setAccountMenu(false);
              }}
              className={`w-full cursor-pointer flex items-center justify-center gap-2 py-3.5 rounded-[1.4rem] text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                }`}
            >
              <i className="ri-user-settings-line text-base"></i>
              Manage Profile
            </button>

            <button
              onClick={() => {
                setAccountMenu(false);
                setShowLogOutBox(true);
              }}
              className={`w-full flex cursor-pointer items-center justify-center gap-2 py-3.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${isDarkMode
                ? " border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-red-400"
                : "border-gray-100 hover:bg-red-50 hover:text-red-600 text-red-400"
                }`}
            >
              <i className="ri-logout-circle-line text-sm"></i>
              Log Out
            </button>
          </div>
        </div>
      )}


      <TermsPrivacyFooter />


    </div>
  );
}

export default AccountMenu;