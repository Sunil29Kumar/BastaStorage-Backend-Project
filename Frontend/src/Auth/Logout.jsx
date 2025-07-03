import {useContext, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";

function Logout() {
  const {setShowLogOutBox, handleLogout} = useContext(BastaStorageContext);

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
    <div
      ref={logoutRef}
      className=" absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]  flex  items-center justify-center bg-black p-10 rounded-md "
    >
      <div className="bg-white rounded-md shadow-xl p-8  text-center">
        <div className="flex justify-center mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Are you sure?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Do you really want to logout from your account?
        </p>
        <div className=" flex justify-between ">
          <Link
            onClick={() => {
              setShowLogOutBox(false);
              handleLogout();
            }}
            className=" w-[10vw] cursor-pointer bg-red-500 text-white font-medium py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </Link>
          <button
            onClick={() => setShowLogOutBox(false)}
            className=" cursor-pointer py-2 px-3 hover:bg-blue-200 rounded-md "
          >
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
