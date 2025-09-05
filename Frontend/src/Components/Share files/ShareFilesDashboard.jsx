import React, { useContext, useEffect, useRef, useState } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";

function ShareFilesDashboard() {
  const { isDarkMode, setShowShareFile, shareLink, shareFileId, setIsShareLinkCopied, storeUserData, inviteUser, fetchSharedUsers, sharedUsersData, inviteUserMessage } = useContext(BastaStorageContext);

  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("View");

  const containerRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowShareFile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  useEffect(() => {
    fetchSharedUsers(shareFileId);
  }, [])

  useEffect(() => {
    if (inviteUserMessage.message) {
      setTimeout(() => {
        setShowShareFile(false);
      }, 2500);
    }
  }, [inviteUserMessage]);

  return (
    <div
      className={` absolute left-0 top-0 w-full h-full flex items-center rounded-md justify-center    ${isDarkMode ? "bg-black/40" : "bg-black/30"}  `}>

      <div
        ref={containerRef}
        className={`w-[40%] rounded-md shadow-lg p-6 space-y-6 ${isDarkMode ? "bg-gray-800" : "bg-white"} `}>
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Share File</h2>

        {/* Private Share */}
        <div>
          <p className="mb-2 font-medium">Invite people</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select value={permission} onChange={(e) => setPermission(e.target.value)}>
              <option value="View">View</option>
              <option value="Edit">Edit</option>
            </select>
          </div>

          {/*  invited list container */}
          <div className={`mt-3  max-h-[30vh] w-full p-2 rounded-md overflow-y-auto flex flex-col gap-1 ${isDarkMode ? "bg-gray-900" : "bg-blue-50"} `}>

            {/* owner  */}
            <div className={` w-full h-[10vh] flex justify-between items-center  rounded-lg p-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>

              <div className=" flex gap-3 justify-center items-center " >
                {/* image */}
                <div className=" w-[3.5vw] h-[3.5vw] rounded-full bg-blue-200 overflow-hidden ">
                  <img
                    src={storeUserData.picture ? `http://localhost:2000${storeUserData.picture}` : "/user-img.png"}
                    alt="User Avatar"
                    className="w-full h-full  object-contain " />
                </div>

                {/* email name  */}
                <div>
                  <p className="text-[1.5vw">{storeUserData.name}</p>
                  <p className={`text-[1vw] ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{storeUserData.email}</p>
                </div>
              </div>

              {/* PERMISSION  */}
              <div>
                <p className={`text-[1vw] ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Owner</p>
              </div>
            </div>


            {/* shared users  */}

            {sharedUsersData && sharedUsersData.length > 0 && (sharedUsersData.map((user, index) => (
              <div key={index} className={` w-full h-[10vh] flex justify-between items-center  rounded-lg p-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>

                <div className=" flex gap-3 justify-center items-center " >
                  {/* image */}
                  <div className=" w-[3.5vw] h-[3.5vw] rounded-full bg-blue-200 overflow-hidden ">
                    <img
                      src={user.userId.picture ? `http://localhost:2000${user.userId.picture}` : "/user-img.png"}
                      alt="User Avatar"
                      className="w-full h-full  object-contain " />
                  </div>

                  {/* email name  */}
                  <div>
                    <p className="text-[1.5vw">{user.userId.name}</p>
                    <p className={`text-[1vw] ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{user.userId.email}</p>
                  </div>
                </div>

                {/* PERMISSION  */}
                <div>
                  <p className={`text-[1vw] ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{user.permission}</p>
                </div>
              </div>
            )))}

          </div>
        </div>



        {/* Public Link */}
        <div>
          <p className="mb-2 font-medium">Get shareable link</p>
          <button
            onClick={() => {
              shareLink(shareFileId)
              setIsShareLinkCopied(true)
              setTimeout(() => {
                setIsShareLinkCopied(false)
              }, 1500);
            }}
            className={` p-2  rounded-md cursor-pointer flex justify-center items-center gap-1 transition-all duration-200 ${isDarkMode ? "bg-gray-700 text-gray-100 hover:bg-blue-500" : "bg-gray-100 text-black hover:bg-blue-400 "}`}>
            <i className="ri-link-m"></i>
            Copy Link
          </button>
        </div>

        {/* Actions */}
        <div
          className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowShareFile(false)
            }}
            className={`px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer ${isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white"}`}>
            Cancel
          </button>
          <button
            onClick={() => {
              inviteUser(email, permission, shareFileId);
            }}
            className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600">
            Done
          </button>
        </div>

        {/* invite user message  */}
        <div>
          {inviteUserMessage.message && (
            <p className="text-sm text-center font-bold  text-green-500">
              {inviteUserMessage.message}
            </p>
          )}
          {inviteUserMessage.error && (
            <p className="text-sm text-center font-bold text-red-500">
              {inviteUserMessage.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareFilesDashboard;
