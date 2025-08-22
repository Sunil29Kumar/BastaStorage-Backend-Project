import React from "react";
import { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { useEffect } from "react";

function AdminDashboard() {
  const { getAllUsers, allUsers } = useContext(BastaStorageContext)

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
     

      {/* Main Content */}
      <main className="p-8">
       
        {/* Manage Users */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Users
            </h2>
            <input
              type="text"
              placeholder="Search users..."
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                {/* <th className="p-3">Role</th> */}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 border-b last:border-0 transition"
                >
                  {/* name  */}
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-[3vw] h-[3vw] flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-semibold  ">
                      <img src={user.picture ? `http://localhost:2000${user.picture}` : ""} alt={user.name} className="w-full h-full object-cover rounded-full text-[1vw]" />
                      {/* {user.name} */}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  {/* email  */}
                  <td className="p-3 text-gray-700">{user.email}</td>
                  {/* is logout  */}
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        // onClick={() => handleUserLogout(u.id)}
                        className={`${user.isLoggedIn ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"} text-white px-3 py-1 rounded-md text-xs`}
                        // disabled={!isLoggedIn}
                      >
                        Logout
                      </button>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
