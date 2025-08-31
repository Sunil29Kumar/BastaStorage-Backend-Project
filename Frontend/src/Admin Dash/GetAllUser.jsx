import React, { useContext, useEffect, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function GetAllUser() {
  const {
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

  const [newRole, setNewRole] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [isRoleUpdating, setIsRoleUpdating] = useState(false)

  const handleUpdateRole = (userId) => {
    setIsRoleUpdating(false)
    updateUserRole(userId, newRole)
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans">
      {/* error / success message */}
      {logoutDeleteByIdMessage?.error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[1vw] px-4 py-2 rounded-lg bg-red-500 text-white shadow-lg">
          {logoutDeleteByIdMessage?.error}
        </div>
      )}
      {logoutDeleteByIdMessage?.success && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[1vw] px-4 py-2 rounded-lg bg-green-500 text-white shadow-lg">
          {logoutDeleteByIdMessage?.success}
        </div>
      )}

      {/* user Role update message  */}
      {updateRoleMessage?.error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[1vw] px-4 py-2 rounded-lg bg-red-500 text-white shadow-lg">
          {updateRoleMessage?.error}
        </div>
      )}
      {updateRoleMessage?.message && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[1vw] px-4 py-2 rounded-lg bg-green-500 text-white shadow-lg">
          {updateRoleMessage?.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-[1.5vw] font-bold text-gray-800 flex gap-2 items-end">
          {storeUserData?.name}
          <span className="text-gray-500 text-[0.9vw]">
            ({storeUserData?.role})
          </span>
        </h1>
        <p className="text-sm text-gray-500">{storeUserData?.email}</p>
      </header>

      {/* Main Content */}
      <main className="p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              👥 Manage Users
              <span className="text-sm text-gray-500 font-normal">
                ({allUsers.length} total)
              </span>
            </h2>
            <input
              type="text"
              placeholder="🔍 Search users..."
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>

          {/* User Table */}
          <div>
            <table className="w-full text-sm border-separate border-spacing-y-2  ">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wide">
                  <th className="p-3 rounded-l-lg text-start">User</th>
                  <th className="p-3 text-start">Email</th>
                  <th className="p-3 text-start">Role</th>
                  <th className="p-3 text-start">Change Role</th>

                  <th className="p-3 text-start">Status</th>
                  <th className="p-3 text-start">Action</th>
                  <th className="p-3 text-start rounded-r-lg">Delete</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-blue-300 shadow rounded-lg transition transform hover:scale-[1.01]  "
                  >
                    {/* User Name + Avatar */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full overflow-hidden">
                        <img
                          src={
                            user.picture
                              ? `http://localhost:2000${user.picture}`
                              : "/user-img.png"
                          }
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-800 font-medium text-[1vw]">
                        {user.name}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="p-3 text-gray-600 text-[0.9vw]">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="p-3  ">
                      <span
                        className={`px-2 py-1 text-[0.9vw] font-medium ${user.role === "admin"
                          ? "text-red-500 bg-red-100 rounded-md"
                          : user.role === "owner"
                            ? "text-purple-500 bg-purple-100 rounded-md"
                            : "text-green-600 bg-green-100 rounded-md"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Change Role Column (Admin + Manager) */}
                    <td className="p-3 ">
                      <select
                        value={user.role}
                        onChange={(e) => {
                          setNewRole(e.target.value);
                          setCurrentUser(user.email);
                          setIsRoleUpdating(true);
                        }}
                        className=" py-1 border rounded-lg text-sm "
                      >
                        {storeUserData?.role === "admin" && (
                          <>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                          </>
                        )}
                        {storeUserData?.role === "manager" && (
                          <>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                          </>
                        )}
                      </select>

                      {isRoleUpdating && user.email === currentUser && (
                        <button
                          onClick={() => handleUpdateRole(user.id)}
                          className="py-1 px-2 ml-2 bg-green-300 text-[1vw] rounded-md cursor-pointer"
                        >
                          Update Role
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-[0.85vw] rounded-full ${user.isLoggedIn
                          ? "bg-green-100 text-green-600 cursor-pointer"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {user.isLoggedIn ? "Online" : "Offline"}
                      </span>
                    </td>

                    {/* Logout Button */}
                    <td className="p-3 text-start">
                      <button
                        disabled={!user.isLoggedIn}
                        onClick={() => logoutUserById(user.id)}
                        className={`px-4 py-1.5 rounded-lg text-[0.9vw] font-medium shadow transition ${user.isLoggedIn
                          ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        Logout
                      </button>
                    </td>

                    {/* Delete Button (Admin Only) */}
                    <td className="p-3 text-start   ">
                      {storeUserData?.role === "admin" && (
                        <button
                          onClick={() => hardDeleteUserById(user.id)}
                          className="px-4 py-1.5 rounded-lg text-[0.9vw] font-medium shadow bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
                        >
                          Hard Delete
                        </button>
                      )}
                      <button
                        onClick={() => softDeleteUserById(user.id)}
                        className={`px-4 py-1.5 ml-3 rounded-lg text-[0.9vw] font-medium shadow 
                             ${user.isLoggedIn
                            ? "bg-orange-400 hover:bg-orange-500 text-white cursor-pointer "
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        Soft Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </main>
    </div>
  );
}

export default GetAllUser;
