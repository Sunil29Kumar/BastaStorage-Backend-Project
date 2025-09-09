import React, { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function TopMenu() {
  const { isDarkMode, setAccountMenu, loggedIn, setIsDarkMode, randomAccountBGcolor, storeUserData, toggleDarkMode } =
    useContext(BastaStorageContext);
  return (
    <div>
      <div className={` w-[100%] flex justify-between items-center px-2 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-white"} `}>
        {/* search bar  */}
        <div className="relative w-[50vw]">
          <input
            type="text"
            placeholder="Search in Basta"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-[1vw]"
          />
          <span className="absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-[1.2vw]">
            🔍
          </span>
        </div>

        <div className=" flex justify-center items-center gap-5 ">

          {/* dark mode toggle  */}

          <i
            onClick={() => toggleDarkMode()}
            className={`ri-${isDarkMode ? "sun" : "moon"}-line text-2xl cursor-pointer transition-all duration-300 ${isDarkMode ? "text-yellow-200" : "text-black"}`}></i>

          {/* user account logo  */}
          <div
            onClick={() => {
              setAccountMenu(true);
            }}

            className=" rounded-full w-[4vw] h-[4vw] cursor-pointer  flex justify-center items-center text-[2vw] font-bold overflow-hidden "
          >
            {storeUserData && (
              <img src={storeUserData.picture ? `http://localhost:2000${storeUserData.picture}` : "/user-img.png"} className="  w-full h-full object-cover " />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default TopMenu;
