import React, { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { FaSearch, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function TopMenu() {
  const {
    isDarkMode,
    setAccountMenu,
    storeUserData,
    toggleDarkMode,
  } = useContext(BastaStorageContext);

  return (
    <div
      className={`w-full h-[10vh] px-5  py-1  rounded-xl flex items-center  justify-between  ${isDarkMode ? "bg-gray-900 text-white" : ""
        }`}
    >
      {/* SEARCH */}
      {useLocation().pathname != "/" ? <div className="relative w-[50%]   ">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
        <input
          type="text"
          placeholder="Search in Basta"
          className={`w-full pl-12 pr-4 py-3 rounded-full text-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode
            ? "bg-gray-500 text-white placeholder-gray-400"
            : "bg-gray-100 text-gray-800 placeholder-blue-400"
            }`}
        />
      </div> :
        <div>
          <h1 className=" text-3xl font-bold ">Home</h1>
        </div>
      }

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${isDarkMode
            ? "bg-gray-800 hover:bg-gray-700"
            : " hover:bg-gray-200"
            }`}
        >
          <FaBell />
        </button>

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-yellow-300"
            : " hover:bg-gray-200"
            }`}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* USER */}
        <div
          onClick={() => setAccountMenu(true)}
          className="w-15 h-15 rounded-full overflow-hidden cursor-pointer border-2 border-blue-400"
        >
          <img
            src={
              storeUserData?.picture
                ? storeUserData.picture
                : "/user-img.png"
            }
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
