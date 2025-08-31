import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import GoogleDriveLayout from "./Google Drive/GoogleDriveLayout";
import RemainingStorage from "./Total Storage/RemainingStorage";

function SideBar() {
  const location = useLocation();
  const { loggedIn, setIsDarkMode, setShowFileFolderMenu, isGDBoxOpen, isDarkMode } = useContext(BastaStorageContext);

  return (
    <div className={`  sideBar w-[17%] relative  flex gap-5 flex-col justify-between  px-2 pb-2 rounded-md  ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black border-r-2 border-blue-100"}`}>
      <div className=" flex flex-col  w-full   gap-5">
        {/* logo  */}
        <div className="logo ">
          <img className="cursor-pointer w-[13vw]" src="../../public/bs.png" />
        </div>

        {/* menu  */}
        <div className="menu flex flex-col  gap-2  ">
          <Link
            to={"/"}
            className={`${location.pathname === "/" ? "bg-blue-500 text-white" : ""
              } cursor-pointer w-[13vw]  px-2 py-1 rounded-md  hover:bg-blue-200 hover:text-black  `}
          >
            <i className="ri-home-4-line"></i> Home
          </Link>
          <Link
            to={"/my-drive"}
            className={`${location.pathname === "/my-drive" ? "bg-blue-500 text-white" : ""
              } cursor-pointer w-[13vw]  px-2 py-1 rounded-md  hover:bg-blue-200 hover:text-black`}
          >
            <i className="ri-history-fill"></i> My Drive
          </Link>
          <Link className=" px-2 py-1 rounded-md  hover:bg-blue-200 hover:text-black   ">
            <i className="ri-history-fill"></i> Recent
          </Link>
        </div>
        <RemainingStorage />
        {/* dark mode toggle  */}
        <div
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={` w-[5vw] h-[5vh] cursor-pointer  rounded-4xl flex items-center ${isDarkMode ? "justify-end bg-white  " : "bg-gray-900 justify-start "} `}
        >
          <div className={`w-[2.5vw] h-[2.5vw] rounded-full flex justify-center items-center ${isDarkMode ?"bg-black text-white ":"bg-white text-yellow-400"} `}>
            <i className={`ri-${isDarkMode ? "moon" : "sun"}-line  `}></i>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        {/* + icon for creating and uploading folder/files */}
        <div
          onClick={() => setShowFileFolderMenu(true)}
          className="flex items-center gap-2 px-2 py-2 bg-blue-500 text-black rounded-md cursor-pointer shadow-md hover:bg-blue-500 hover:text-white transition-all duration-200"
        >
          <i className="ri-add-line text-xl"></i>
          <span className="text-base font-medium">New</span>
        </div>


      </div>
      {isGDBoxOpen && <GoogleDriveLayout />}
    </div>
  );
}

export default SideBar;
