import React, { useContext, useState, useEffect } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { FaSearch, FaBell, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function TopMenu() {
  const {
    isDarkMode,
    setAccountMenu,
    storeUserData,
    toggleDarkMode,
    notificationsData,
    setIsClickOnNotificationBell,
    BASE_URL,
    isClickOnNotificationBell,
    filesList,
    directoriesList
  } = useContext(BastaStorageContext);

  const pathname = useLocation().pathname;
  const [searchInput, setSearchInput] = useState("");

  // Filter Logic with Safety Checks
  const filteredFiles = searchInput.length > 0
    ? filesList?.filter((file) => file?.name?.toLowerCase().includes(searchInput.toLowerCase()))
    : [];

  const filteredFolders = searchInput.length > 0
    ? directoriesList?.filter((folder) => folder?.name?.toLowerCase().includes(searchInput.toLowerCase()))
    : [];

  const hasResults = filteredFiles.length > 0 || filteredFolders.length > 0;

  return (
    <div className={`w-full h-[10vh]   px-4 flex items-center justify-between gap-10 transition-all duration-300`}>


      {/* --- LEFT: SEARCH SECTION --- */}
      {(pathname === "/my-files" || pathname.startsWith("/directory/")) ? (
        <div className="relative w-full max-w-[450px] group transition-all duration-500 ease-in-out focus-within:max-w-[550px]">
          <div className={`relative flex items-center transition-all duration-300 ${isDarkMode ? "text-gray-400 focus-within:text-blue-400" : "text-blue-400"}`}>
            <FaSearch className="absolute left-4 z-10 transition-transform group-focus-within:scale-110" />

            <input
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              type="text"
              placeholder="Search files, folders..."
              className={`w-full pl-12 pr-12 py-2.5 rounded-2xl text-sm font-medium transition-all outline-none border-2
              ${isDarkMode
                  ? "bg-gray-900/50 border-white/5 text-white focus:bg-gray-900 focus:border-blue-500/50"
                  : "bg-gray-100 border-transparent text-gray-800 focus:bg-white focus:border-blue-500/30 shadow-sm"
                }`}
            />



            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 p-1 rounded-full hover:bg-gray-500/10 transition-all"
              >
                <FaTimes className="text-xs cursor-pointer hover:text-red-500 transition-colors" />
              </button>
            )}
          </div>

          {/* --- SEARCH RESULT BOX --- */}
          {searchInput.length > 0 && (
            <div className={`absolute top-full left-0 w-full max-h-[420px] overflow-y-auto mt-3 rounded-2xl z-[100] border shadow-2xl backdrop-blur-xl transition-all animate-in fade-in slide-in-from-top-2
            ${isDarkMode
                ? "bg-[#1a1d21]/95 border-white/10 shadow-black/60"
                : "bg-white/95 border-gray-100 shadow-blue-500/20"
              }`}>

              {!hasResults ? (
                <div className="p-12 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <i className="ri-search-eye-line text-3xl text-gray-400"></i>
                  </div>
                  <p className="text-sm font-bold text-gray-500">No results for "{searchInput}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">

                  {/* Folders Section */}
                  {filteredFolders.length > 0 && (
                    <div>
                      <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-500/70">Folders</p>
                      {filteredFolders.map((folder) => (
                        <Link
                          to={`/directory/${folder.id}`}
                          key={folder.id}
                          onClick={() => setSearchInput("")}
                          className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isDarkMode ? "hover:bg-white/5" : "hover:bg-blue-50/50"}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <i className="ri-folder-fill text-3xl text-yellow-500/80 group-hover:scale-110 transition-transform"></i>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <i className="ri-arrow-right-s-line text-[10px] text-white"></i>
                              </div>
                            </div>
                            <div>
                              <span className={`text-sm font-bold block ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{folder.name}</span>
                              <span className="text-[10px] text-gray-500 font-medium">Click to open basta</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Separator */}
                  {filteredFolders.length > 0 && filteredFiles.length > 0 && (
                    <div className={`mx-4 my-2 border-t ${isDarkMode ? "border-white/5" : "border-gray-100"}`}></div>
                  )}

                  {/* Files Section */}
                  {filteredFiles.length > 0 && (
                    <div>
                      <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-500/70">Files</p>
                      {filteredFiles.map((file) => (
                        <a
                          href={`${BASE_URL}/file/${file.id}`}
                          key={file.id}
                          className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isDarkMode ? "hover:bg-white/5" : "hover:bg-blue-50/50"}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? "bg-gray-800 group-hover:bg-blue-500/20" : "bg-gray-50 group-hover:bg-blue-50"}`}>
                              <i className={`text-xl ${isDarkMode ? "text-blue-400" : "text-blue-500"} ri-file-list-3-line`}></i>
                            </div>
                            <div>
                              <p className={`text-sm font-bold block ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{file.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-500 font-bold uppercase">{file.name.split('.').pop()}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                          </div>
                          <i className="ri-download-cloud-fill text-xl text-blue-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"></i>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1">
          {pathname === "/" && (
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>Dashboard</h1>
            </div>
          )}
        </div>
      )}



      {/* --- RIGHT: ACTIONS SECTION --- */}

      <div className="flex items-center gap-3 ml-4">

        {/* Role Badge */}
        {storeUserData?.role !== "user" && (
          <Link to="/users" className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
            ${isDarkMode ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"}`}>
            <i className="ri-shield-user-fill text-xs"></i>
            {storeUserData?.role}
          </Link>
        )}

        {/* Action Buttons Group */}
        <div className={`flex items-center  rounded-2xl ${isDarkMode ? "bg-gray-800/40" : "bg-gray-100"}`}>
          {/* Notification */}
          <button
            onClick={() => setIsClickOnNotificationBell(!isClickOnNotificationBell)}
            className={`w-10 h-10 relative cursor-pointer rounded-xl flex items-center justify-center transition-all active:scale-90 ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-600 shadow-sm"}`}>
            <FaBell className={notificationsData?.some(n => !n.read) ? "text-red-500 animate-swing" : ""} />
            {notificationsData?.filter(n => !n.read).length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-inherit animate-ping"></span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-10 rounded-xl cursor-pointer flex items-center justify-center transition-all active:scale-90 ${isDarkMode ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-white text-gray-600 shadow-sm"}`}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* User Profile */}
        <div
          onClick={() => setAccountMenu(true)}
          className={`relative group  cursor-pointer p-0.5 rounded-full border-2 transition-all active:scale-95
            ${isDarkMode ? "border-blue-700 hover:border-blue-500" : "border-white hover:border-blue-400 shadow-md"}`}>
          <div className="w-15 h-15 rounded-full overflow-hidden">
            <img
              src={storeUserData?.picture || "/user-img.png"}
              alt="avatar"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default TopMenu;