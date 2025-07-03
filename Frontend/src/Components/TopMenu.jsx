import React, {useContext} from "react";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";

function TopMenu() {
  const {setAccountMenu, randomAccountBGcolor, storeUserData} =
    useContext(BastaStorageContext);
  return (
    <div>
      <div className=" w-[100%] flex justify-between items-center   ">
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
        {/* user account logo */}
        <div className="  ">
          <p
            onClick={() => {
              setAccountMenu(true);
            }}
            style={{backgroundColor: `${randomAccountBGcolor}`}}
            className="border-2 border-white rounded-full w-[4vw] h-[4vw] cursor-pointer  flex justify-center items-center text-[2vw] font-bold "
          >
            {storeUserData && storeUserData.name.slice(0, 1).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TopMenu;
