
import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import RemainingStorage from "./Total Storage/RemainingStorage";
import UpgradePlanCard from "./Total Storage/UpgradePlan";


function SideBar() {
  const location = useLocation();
  const { setShowFileFolderMenu, isDarkMode, isNavMinimized, setIsNavMinimized } =
    useContext(BastaStorageContext);


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
        <div className="h-[10vh] flex items-center  ">
          <img
            src="../../public/bst logo.png"
            className="w-[4vw] cursor-pointer"
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
              to="/storage"
              className={`${baseClass} ${location.pathname === "/storage" && activeClass
                }`}
            >
              <i className={`ri-cloud-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Storage"}
            </Link>

          </div>
        </div>

        {/* REPORTS */}
        <div>
          <p className={`text-sm text-gray-400 mb-1 ${isNavMinimized ? "text-center" : ""} `}>Reports</p>
          <Link to="/analytics" className={baseClass}>
            <i className={`ri-bar-chart-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Storage Analytics"}
          </Link>

        </div>

        {/* SETTINGS */}
        <div>
          <p className={`text-sm text-gray-400 mb-1 ${isNavMinimized ? "text-center" : ""} `}>Settings</p>
          <Link to="/help" className={baseClass}>
            <i className={`ri-question-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Help & Support"}
          </Link>

          <Link to="/settings" className={baseClass}>
            <i className={`ri-settings-3-line ${isNavMinimized ? "text-xl" : "text-xl"} `}></i> {!isNavMinimized && "Settings"}
          </Link>
        </div>
      </div>

      {/* plan  */}
      {/* <RemainingStorage /> */}
      <UpgradePlanCard />

      {/* BOTTOM CREATE BUTTON */}
      <div>
        <button
          onClick={() => setShowFileFolderMenu(true)}
          className="w-full flex items-center justify-center cursor-pointer gap-2
          bg-blue-400 text-white py-2 rounded-lg
          hover:bg-blue-500 "
        >
          <i className="ri-add-line text-lg"></i>
          {!isNavMinimized && "Create New"}
        </button>
      </div>


    </div>
  );
}

export default SideBar;
