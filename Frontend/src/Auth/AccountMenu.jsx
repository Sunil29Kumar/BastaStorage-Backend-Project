import React, {useContext, useEffect, useRef} from "react";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";

function AccountMenu() {
  const {
    setAccountMenu,
    setShowLogOutBox,
    storeUserData,
    randomAccountBGcolor,
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
      className=" absolute min-w-[25vw]  right-[1%] top-[11%]  shadow-xl rounded-md p-4 space-y-2 bg-blue-50 flex flex-col gap-2 "
    >
      {storeUserData && (
        <div className=" flex flex-col items-center gap-5 ">
          <h2 className="text-[1.2vw] ">{storeUserData.email}</h2>
          <div>
            <p
              style={{backgroundColor: `${randomAccountBGcolor}`}}
              className="border-2 border-white rounded-full w-[4vw] h-[4vw] cursor-pointer bg-blue-400 flex justify-center items-center text-[2vw] "
            >
              {storeUserData.name.slice(0, 1).toUpperCase()}
            </p>
            <h2 className="font-semibold text-lg">Hi, {storeUserData.name}</h2>
          </div>
        </div>
      )}
      <div className=" flex w-[100%]  justify-center">
        <button className="text-left cursor-pointer px-7 py-2 rounded-2xl text-gray-700 hover:bg-blue-100 hover:text-black ">
          Manage You Profile
        </button>
      </div>
      <div className=" flex w-[100%]  justify-end">
        <button
          onClick={() => {
            setAccountMenu(false);
            setShowLogOutBox(true);
          }}
          className=" cursor-pointer text-left px-4 py-2 rounded-2xl hover:bg-red-100 text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountMenu;
