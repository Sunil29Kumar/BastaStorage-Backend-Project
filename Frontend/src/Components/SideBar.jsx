
import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import UpgradePlanCard from "../plans/UpgradePlan";


function SideBar() {
  const location = useLocation();
  const { setShowFileFolderMenu, showFileFolderMenu,isDarkMode, isNavMinimized, setIsNavMinimized } =
    useContext(BastaStorageContext);

  const windowWidth = window.innerWidth;
  console.log("width =", windowWidth);


  useEffect(() => {
    if (windowWidth <= 1200) {
      setIsNavMinimized(true);
    }
  }, [windowWidth, setIsNavMinimized]);

  const activeClass = "bg-blue-400 text-white";
  const baseClass = `flex ${isNavMinimized ? "justify-center px-0" : "px-3"} items-center gap-3  py-2 rounded-md cursor-pointer hover:bg-blue-200 hover:text-black `;

  return (
    <div
      className={` relative ${isNavMinimized ? "w-[6%]" : "w-[17%]"} transition-all duration-100 ease-in-out h-full flex flex-col justify-between px-3 py-1
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >

      {/* minimize button  */}
      <button
        onClick={() => setIsNavMinimized(!isNavMinimized)}
        className={` absolute ${!isNavMinimized ? "right-[-5%] top-[50%] " : "right-[-50%] top-[50%] "}translate-y-[-50%] px-3 py-2  rounded-full cursor-pointer hover:bg-blue-50    z-100  `}>
        <i className={`ri-arrow-${isNavMinimized ? "right" : "left"}-s-fill text-3xl `}></i>
      </button>


      {/* TOP SECTION */}
      <div className="flex flex-col gap-3">
        {/* LOGO */}
        <div className="h-[10vh] flex items-center   ">
          <img
            src={`${isDarkMode ?"/basta logo.png" : "/bst logo.png"}`}
            className="w-[4vw] cursor-pointer bg-black "
            alt="logo"
          />
        </div>

        {/* GENERAL */}
        <div>
          <p className={`text-sm text-gray-400 mb-1 ${isNavMinimized ? "text-center" : ""} `}>General</p>
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className={`${baseClass} ${location.pathname === "/" && activeClass
                }`}
            >
              <i className={`ri-home-2-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Home"}
            </Link>

            <Link
              to="/my-files"
              className={`${baseClass} ${location.pathname === "/my-files" && activeClass
                }`}
            >
              <i className={`ri-folder-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "File Management"}
            </Link>

            <Link
              to="/storageOverview"
              className={`${baseClass} ${location.pathname === "/storageOverview" && activeClass
                }`}
            >
              <i className={`ri-cloud-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Storage"}
            </Link>

          </div>
        </div>

        {/* REPORTS */}
        <div>
          <p className={`text-sm text-gray-400 mb-1 ${isNavMinimized ? "text-center" : ""} `}>Reports</p>
          <Link to="/storageAnalytics"
            className={`${baseClass} ${location.pathname === "/storageAnalytics" && activeClass
              }`}>
            <i className={`ri-bar-chart-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Storage Analytics"}
          </Link>

        </div>

        {/* SETTINGS */}
        <div>
          <p className={`text-sm text-gray-400 mb-1 ${isNavMinimized ? "text-center" : ""} `}>Settings</p>
          <Link to="/help-support" className={baseClass}>
            <i className={`ri-question-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Help & Support"}
          </Link>

          <Link to="/settings" className={baseClass}>
            <i className={`ri-settings-3-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Settings"}
          </Link>
        </div>
      </div>

      {/* plan  */}
      <UpgradePlanCard />

      {/* BOTTOM CREATE BUTTON */}
      <div className={`px-2 mt-auto mb-4 transition-all duration-300`}>
        <button
          onClick={() => setShowFileFolderMenu(!showFileFolderMenu)}
          className={`
          group relative flex items-center justify-center gap-3 cursor-pointer
          transition-all duration-500 ease-in-out
          /* Shape & Size */
          ${isNavMinimized
              ? "w-14 h-14 rounded-2xl mx-auto"
              : "w-full py-4 rounded-[1.5rem]"
            }
          /* Colors & Effects */
          bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
          text-white shadow-xl shadow-blue-500/30
          hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95
          overflow-hidden
        `}
        >
          {/* Animated Background Shine */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>

          {/* Icon */}
          <div className={`flex items-center justify-center transition-transform duration-500 ${isNavMinimized ? "scale-125" : "group-hover:rotate-90"}`}>
            <i className="ri-add-line text-2xl font-bold"></i>
          </div>

          {/* Text */}
          {!isNavMinimized && (
            <span className="text-xs font-black uppercase tracking-[0.2em] transition-opacity duration-300">
              Create New
            </span>
          )}

          {/* Tooltip for Minimized State */}
          {isNavMinimized && (
            <div className="absolute left-20 px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[200]">
              Create New Folder/File
            </div>
          )}
        </button>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>


    </div>
  );
}

export default SideBar;
