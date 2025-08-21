import React from "react";

function AdminDashboard() {
  const users = [
    { id: 1, name: "Radha", email: "radha@example.com", role: "Admin" },
    { id: 2, name: "Sunil", email: "sunil@example.com", role: "User" },
    { id: 3, name: "Priya", email: "priya@example.com", role: "Editor" },
  ];

  const currentUser = {
    name: "Radha",
    email: "radha@example.com",
    storageUsed: 65,
  };

  const handleUserLogout = (userId) => {
    console.log(`User with ID ${userId} logged out by Admin`);
  };

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "bg-red-100 text-red-600",
      User: "bg-blue-100 text-blue-600",
      Editor: "bg-green-100 text-green-600",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role]}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-white shadow px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-800">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">1245</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Reports</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">87</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">$12,430</p>
          </div>
        </div>

        {/* Storage Section */}
        <div className="bg-white rounded-xl p-6 shadow mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Your Storage Usage
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-5">
            <div
              className="bg-blue-500 h-5 rounded-full text-right pr-2 text-xs text-white flex items-center justify-end"
              style={{ width: `${currentUser.storageUsed}%` }}
            >
              {currentUser.storageUsed}%
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {currentUser.storageUsed}% of 100% used
          </p>
        </div>

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
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 border-b last:border-0 transition"
                >
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-semibold">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3 text-gray-700">{u.email}</td>
                  <td className="p-3">{getRoleBadge(u.role)}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs">
                        Edit
                      </button>
                      <button
                        onClick={() => handleUserLogout(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Logout
                      </button>
                      <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-xs">
                        Delete
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
