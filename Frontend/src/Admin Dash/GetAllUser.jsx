import React, { useContext, useEffect } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function GetAllUser() {
  const { getAllUsers, allUsers, storeUserData, logoutUserById, hardDeleteUserById, logoutDeleteByIdMessage, softDeleteUserById } = useContext(BastaStorageContext);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className=" relative min-h-screen bg-gray-50 font-sans">
      {/* error / success message  */}
      {logoutDeleteByIdMessage?.error && (
        <div className=" absolute bottom-2  left-[50%] translate-x-[-50%] text-[1.5vw] px-3 py-2 rounded-md bg-red-400 text-black ">
          {logoutDeleteByIdMessage?.error}
        </div>
      )}
      {logoutDeleteByIdMessage?.success && (
        <div className=" absolute bottom-2  left-[50%] translate-x-[-50%] text-[1.5vw] px-3 py-2 rounded-md bg-green-400 text-black ">
          {logoutDeleteByIdMessage?.success}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-[2vw] font-bold text-gray-800 flex gap-2 justify-center items-end ">
          {storeUserData?.name}<span className="text-gray-500 text-[1vw] ">( {storeUserData?.role} )</span>
        </h1>
        <p className="text-sm text-gray-500">{storeUserData?.email}</p>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wide">
                  <th className="p-3 rounded-l-lg text-start ">User</th>
                  <th className="p-3 text-start">Email</th>
                  <th className="p-3 text-start">Role</th>
                  <th className="p-3 text-start">Status</th>
                  <th className="p-3 text-start">Action</th>
                  {storeUserData?.role === "admin" && (
                    <th className="p-3 text-start rounded-r-lg">Delete</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-gray-50 shadow-sm rounded-lg transition"
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
                      <span className=" text-gray-800 text-[1.2vw] font-bold ">{user.name}</span>
                    </td>

                    {/* Email */}
                    <td className="p-3 text-gray-600 text-[1vw] ">{user.email}</td>

                    {/* Role */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-[1.2vw] rounded-full ${user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full text-[1.2vw] ${user.isLoggedIn
                          ? "bg-blue-100 text-blue-600"
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
                        className={`px-4 py-1.5 rounded-lg text-[1vw] font-medium transition  ${user.isLoggedIn
                          ? "bg-blue-500 hover:bg-red-600 text-white cursor-pointer "
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        Logout
                      </button>
                    </td>

                    {/* Delete Button (Admin Only) */}
                    {storeUserData?.role === "admin" && (
                      <td className="p-3 text-start flex gap-2  ">
                        <button
                          onClick={() => hardDeleteUserById(user.id)}
                          className={`px-4 py-1.5 rounded-lg text-[1vw] font-medium transition cursor-pointer 
                            bg-red-500 hover:bg-red-700 hover:text-white
                            `}
                        >
                          Hard Delete
                        </button>
                        <button
                          onClick={() => softDeleteUserById(user.id)}
                          className={`px-4 py-1.5 rounded-lg text-[1vw] font-medium transition cursor-pointer 
                            bg-red-400 hover:bg-blue-600 hover:text-white
                            `}
                        >
                          Soft Delete
                        </button>
                      </td>
                    )}
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
