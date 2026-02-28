import { useContext, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import UpgradePlanCard from "../plans/UpgradePlan";
import { FaBars, FaTimes } from "react-icons/fa";

function SideBar() {
  const location = useLocation();
  const {
    setShowFileFolderMenu,
    showFileFolderMenu,
    isDarkMode,
    isNavMinimized,
    setIsNavMinimized,
    windowWidth
  } = useContext(BastaStorageContext);

  // 1. Sidebar Width & Visibility Logic
  const { sidebarWidth, isMobileView, shouldHideStrictly } = useMemo(() => {
    const mobile = windowWidth < 1000;
    const hideStrictly = mobile && isNavMinimized; // Hide completely if mobile + minimized

    let width = "w-[17%]"; // Default Desktop
    if (isNavMinimized) {
      width = "w-[8%]";
    }
    if (isNavMinimized && windowWidth < 1285 && windowWidth >= 1000) {
      width = "w-[9%]";
    }
    else {
      if (windowWidth < 1285 && windowWidth >= 1000) width = "w-[23%]";
      else if (windowWidth < 1000 && windowWidth >= 800) width = "w-[40%]";
      else if (windowWidth < 800 && windowWidth > 600) width = "w-[70%]";
      else if (windowWidth <= 600) width = "w-full";
    }

    return { sidebarWidth: width, isMobileView: mobile, shouldHideStrictly: hideStrictly };
  }, [windowWidth, isNavMinimized]);

  // 2. Auto-minimize when entering mobile view
  useEffect(() => {
    if (windowWidth < 1000) {
      setIsNavMinimized(true);
    }
  }, [windowWidth, setIsNavMinimized]);

  // Styles
  const activeClass = "bg-blue-500 text-white shadow-lg shadow-blue-500/20";
  const baseClass = `flex  font-bold ${isNavMinimized ? "justify-center px-0  " : "px-4"} items-center gap-3 py-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800`;

  // 3. Close sidebar menu on outside click
  const sideNavRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sideNavRef.current && !sideNavRef.current.contains(e.target) && windowWidth < 1000) {
        setIsNavMinimized(true)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsNavMinimized]);

  return (
    <>

      {/* MAIN SIDEBAR CONTAINER */}
      <div
        ref={sideNavRef}
        className={`fixed  left-0 top-0 z-[50] transition-all duration-300 ease-in-out h-[100vh]  flex flex-col justify-between 
        ${isNavMinimized ? "py-5" : "pb-2"}  px-3
        ${isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white  border-gray-200 text-black "}
        ${sidebarWidth} 
        ${shouldHideStrictly ? "-translate-x-full" : "translate-x-0"} 
        `}
      >
        <div className="flex flex-col gap-7   ">

          {/* LOGO & TOGGLE SECTION */}
          <div className={`flex  items-end  ${isNavMinimized ? "justify-center" : "justify-between"} `}>
            {!isNavMinimized && (
              <img
                src={isDarkMode ? "/basta logo.png" : "/bst logo.png"}
                className={` ${windowWidth > 1285 ? "h-20" : "h-25"} object-contain p-1 rounded`}
                alt="logo"
              />
            )}
            <button
              onClick={() => setIsNavMinimized(!isNavMinimized)}
              className="p-2  rounded-lg hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 transition-colors text-blue-500"
            >
              {isNavMinimized ? <FaBars size={30} /> : <FaTimes size={25} />}
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <div className={`flex flex-col gap-2 overflow-y-auto  px-2
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-blue-400
              [&::-webkit-scrollbar-thumb]:rounded-full
              ${isNavMinimized ? "h-[70vh] " : windowWidth < 1000 ? "h-[65vh]" : "h-[55vh] "} 
            `}>
            <p className={`text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 ${isNavMinimized ? "text-center px-0" : ""}`}>
              {isNavMinimized ? "••" : "General"}
            </p>

            <NavLink to="/home" icon="ri-home-2-line" label="Home" size={100}
              active={location.pathname === "/"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <NavLink to="/my-files" icon="ri-folder-line" label="My Files"
              active={location.pathname === "/my-files"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <NavLink to="/storageOverview" icon="ri-cloud-line" label="Storage"
              active={location.pathname === "/storageOverview"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <NavLink to="/trash" icon="ri-delete-bin-line" label="Trash"
              active={location.pathname === "/trash"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <NavLink to="/recent-files" icon="ri-file-list-line" label="Recent Files"
              active={location.pathname === "/recent-files"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <NavLink to="/favorites" icon="ri-star-line" label="Favorites"
              active={location.pathname === "/favorites"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

            <p className={`text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 ${isNavMinimized ? "text-center px-0" : ""}`}>
              {isNavMinimized ? "••" : "Account"}
            </p>

            <NavLink to="/storageAnalytics" icon="ri-bar-chart-line" label="Analytics"
              active={location.pathname === "/storageAnalytics"} isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />

            <NavLink to="/settings" icon="ri-settings-3-line" label="Settings"
              active={location.pathname === "/settings"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />
            <NavLink to="/help-support" icon="ri-question-line" label="Help & Support"
              active={location.pathname === "/help-support"}
              isNavMinimized={isNavMinimized}
              baseClass={baseClass}
              activeClass={activeClass}
              setIsNavMinimized={setIsNavMinimized}
              windowWidth={windowWidth} />
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-3  ">
          {!isNavMinimized && <UpgradePlanCard />}

          {windowWidth >= 1000 && (
            <button
              onClick={() => setShowFileFolderMenu(!showFileFolderMenu)}
              className={`group  relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 cursor-pointer
              ${isNavMinimized ? "w-16 h-13 rounded-xl mx-auto" : "w-full py-4 rounded-2xl"}
              hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 overflow-hidden`}
            >
              <i className="ri-add-line text-2xl"></i>
              {!isNavMinimized && <span className="font-bold uppercase text-xs tracking-wider">Create New</span>}
            </button>
          )}

        </div>
      </div>



      {/* FLOATING ACTION BUTTON (FAB) - Visible ONLY when mobile + sidebar hidden */}
      {shouldHideStrictly && (
        <div className=" bg-amber-300 ">
          <button
            onClick={() => setShowFileFolderMenu(!showFileFolderMenu)}
            className={`group  fixed bottom-25 z-60 left-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 cursor-pointer
              ${isNavMinimized ? "w-15 h-15 rounded-xl mx-auto" : "w-full py-4 rounded-2xl"}
              hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 overflow-hidden`}
          >
            <i className="ri-add-line text-2xl"></i>
          </button>

          <button
            onClick={() => setIsNavMinimized(false)}
            className="fixed bottom-4 left-2 cursor-pointer z-[60] p-5 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-subtle"
          >
            <FaBars size={24} />
          </button>
        </div>

      )}

      {/* Custom Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
      `}</style>
    </>
  );
}

// Sub-component for Cleaner Code
function NavLink({ to, icon, label, active, isNavMinimized, baseClass, activeClass, setIsNavMinimized, windowWidth }) {
  return (
    <Link to={to}
      onClick={() => windowWidth < 1000 && setIsNavMinimized(!isNavMinimized)}
      className={`${baseClass} ${active ? activeClass : "text-gray-500 dark:text-gray-400"}`}>
      <i className={`${icon} text-xl`}></i>
      {!isNavMinimized && <span className="font-semibold text-[15px]">{label}</span>}
    </Link>
  );
}

export default SideBar;