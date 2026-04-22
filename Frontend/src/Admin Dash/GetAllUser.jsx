import React, { useContext, useEffect, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { useNavigate } from "react-router-dom";

function GetAllUser() {
  const {
    isDarkMode,
    getAllUsers,
    allUsers,
    storeUserData,
    logoutUserById,
    hardDeleteUserById,
    logoutDeleteByIdMessage,
    softDeleteUserById,
    updateUserRole,
    updateRoleMessage
  } = useContext(BastaStorageContext);

  const navigate = useNavigate();
  const [newRole, setNewRole] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateRole = (userId) => {
    setIsRoleUpdating(false);
    updateUserRole(userId, newRole);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#0f1113] text-white" : "bg-gray-50 text-gray-800"}`}>

      {/* --- TOP NAVIGATION BAR --- */}
      <nav className={`sticky top-0 z-50 px-4 md:px-8 py-4 flex justify-between items-center backdrop-blur-md border-b ${isDarkMode ? "bg-[#1c1f23]/80 border-white/5" : "bg-white/80 border-gray-100 shadow-sm"}`}>
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => navigate("/home")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-95 ${isDarkMode ? "bg-white/5 hover:bg-white/10 text-blue-400" : "bg-blue-50 hover:bg-blue-100 text-blue-600"}`}
          >
            <i className="ri-home-4-fill text-lg"></i>
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <div className="h-6 w-[1px] bg-gray-500/20 hidden sm:block"></div>
          <h1 className="text-sm md:text-lg font-black tracking-tight whitespace-nowrap">
            User <span className="text-blue-500">Panel</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{storeUserData?.name}</p>
            <p className="text-[9px] font-bold opacity-40 uppercase">{storeUserData?.role}</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-500/30 overflow-hidden shadow-lg">
            <img src={storeUserData?.picture ? storeUserData.picture : "/user-img.png"} className="w-full h-full object-cover" alt="Admin" />
          </div>
        </div>
      </nav>

      {/* --- NOTIFICATION MESSAGES --- */}
      {(logoutDeleteByIdMessage?.success || updateRoleMessage?.message) ? (
        <div className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto px-6 py-3 rounded-2xl bg-green-500 text-white shadow-2xl animate-bounce flex items-center justify-center gap-2 text-center">
          <i className="ri-checkbox-circle-fill text-lg"></i>
          <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">{logoutDeleteByIdMessage?.success || updateRoleMessage?.message}</span>
        </div>
      ) :
        (logoutDeleteByIdMessage?.error || updateRoleMessage?.error) && (
          <div className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto px-6 py-3 rounded-2xl bg-red-500 text-white shadow-2xl animate-bounce flex items-center justify-center gap-2 text-center">
            <i className="ri-error-warning-fill text-lg"></i>
            <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">{logoutDeleteByIdMessage?.error || updateRoleMessage?.error}</span>
          </div>
        )}

      {/* --- MAIN CONTENT --- */}
      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">

        {/* HEADER & SEARCH */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Manage Users</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">System Administration Area</p>
          </div>

          <div className="relative w-full lg:w-80">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 opacity-30"></i>
            <input
              type="text"
              placeholder="SEARCH USERS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${isDarkMode ? "bg-[#1c1f23] border-white/5 focus:border-blue-500/50" : "bg-white border-gray-100 focus:border-blue-400 shadow-sm"}`}
            />
          </div>
        </div>

        {/* --- MOBILE/TABLET CARD VIEW --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`p-5 rounded-3xl border transition-all ${isDarkMode ? "bg-[#1c1f23] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={user?.picture ? user.picture : "/user-img.png"} className="w-12 h-12 rounded-2xl object-cover" alt="Profile" />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isDarkMode ? "border-[#1c1f23]" : "border-white"} ${user.isLoggedIn ? "bg-green-500" : "bg-gray-400"}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight leading-tight">{user.name}</p>
                    <p className="text-[10px] opacity-40 truncate w-32">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${user.role === 'admin' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>{user.role}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-500/5">
                <select
                  value={user.role}
                  onChange={(e) => { setNewRole(e.target.value); setCurrentUser(user.email); setIsRoleUpdating(true); }}
                  className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase outline-none border ${isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200"}`}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>

                <div className="flex gap-2">
                  {/* Actions with Hover for Mobile Grid */}
                  <button onClick={() => logoutUserById(user.id)} disabled={!user.isLoggedIn} className={`p-2.5 rounded-xl transition-all ${user.isLoggedIn ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white" : "opacity-20"}`}><i className="ri-logout-box-r-line"></i></button>
                  <button onClick={() => softDeleteUserById(user.id)} className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"><i className="ri-user-unfollow-line"></i></button>
                  {storeUserData?.role === "admin" && (
                    <button onClick={() => hardDeleteUserById(user.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="ri-delete-bin-2-line"></i></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP TABLE VIEW --- */}
        <div className={`hidden lg:block rounded-[2.5rem] overflow-hidden border shadow-2xl ${isDarkMode ? "bg-[#1c1f23] border-white/5 shadow-black/40" : "bg-white border-gray-100 shadow-gray-200/50"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "bg-white/5 border-white/5 text-gray-400" : "bg-gray-50 border-gray-100 text-gray-500"}`}>
                  <th className="px-8 py-5">User Profile</th>
                  <th className="px-6 py-5">Access Level</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Permissions</th>
                  <th className="px-8 py-5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`group transition-all ${isDarkMode ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"}`}>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user?.picture ? user.picture : "/user-img.png"} className="w-11 h-11 rounded-2xl object-cover shadow-md" alt="User" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isDarkMode ? "border-[#1c1f23]" : "border-white"} ${user.isLoggedIn ? "bg-green-500" : "bg-gray-400"}`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight leading-none mb-1">{user.name}</p>
                          <p className="text-[10px] font-bold opacity-40 lowercase">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? "bg-red-500/10 text-red-500" : user.role === 'manager' ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}>{user.role}</span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isLoggedIn ? "bg-green-500" : "bg-gray-400"}`}></span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{user.isLoggedIn ? "Active" : "Offline"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => { setNewRole(e.target.value); setCurrentUser(user.email); setIsRoleUpdating(true); }}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase outline-none border cursor-pointer transition-all ${isDarkMode ? "bg-black/20 border-white/10 hover:border-blue-500/50" : "bg-gray-50 border-gray-200 hover:border-blue-300"}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                        {isRoleUpdating && user.email === currentUser && (
                          <button onClick={() => handleUpdateRole(user.id)} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg transition-transform active:scale-90 cursor-pointer"><i className="ri-check-line text-lg"></i></button>
                        )}
                      </div>
                    </td>

                    {/* DESKTOP HOVER ACTIONS RESTORED */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={!user.isLoggedIn}
                          onClick={() => logoutUserById(user.id)}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${user.isLoggedIn ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white" : "opacity-20 cursor-not-allowed"}`}
                          title="Force Logout"
                        >
                          <i className="ri-logout-box-r-line text-lg"></i>
                        </button>

                        <button
                          onClick={() => softDeleteUserById(user.id)}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white"}`}
                          title="Soft Delete"
                        >
                          <i className="ri-user-unfollow-line text-lg"></i>
                        </button>

                        {storeUserData?.role === "admin" && (
                          <button
                            onClick={() => hardDeleteUserById(user.id)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"}`}
                            title="Permanent Hard Delete"
                          >
                            <i className="ri-delete-bin-2-line text-lg"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <i className="ri-user-search-line text-6xl mb-4"></i>
            <p className="text-sm font-black uppercase tracking-[0.4em]">No matching users</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GetAllUser;