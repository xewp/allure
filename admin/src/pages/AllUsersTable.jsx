import React, { useState, useEffect } from "react";
import API_URL from "../config/api";

const AllUsersTable = () => {
  const themeColor = "#d6b48e";
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/superadmin/users?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendToggle = async (userId, currentStatus) => {
    if (!confirmAction) {
      setConfirmAction({
        userId,
        action: currentStatus ? "unsuspend" : "suspend",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/superadmin/users/${userId}/suspend`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        alert(data.message);
      } else {
        alert(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error toggling user suspension:", error);
      alert("Error updating user status");
    } finally {
      setConfirmAction(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: themeColor }}
        >
          User Management
        </h1>
        <p className="text-gray-400">Manage all platform users</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
          className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
        />
      </div>

      {/* Users Count */}
      <div className="mb-4 text-gray-400">Total Users: {pagination.total}</div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: themeColor }}>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Name
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Email
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Phone
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Joined
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Status
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <td className="p-4 text-white">
                    {user.firstName} {user.lastName}
                    <br />
                    <span className="text-sm text-gray-500">
                      @{user.username}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4 text-gray-300">{user.phoneNumber}</td>
                  <td className="p-4 text-gray-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4">
                    {user.suspended ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-900 text-red-200">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-900 text-green-200">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleSuspendToggle(user._id, user.suspended)
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        user.suspended
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {user.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-white">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div
            className="bg-gray-900 rounded-2xl p-8 max-w-md border"
            style={{ borderColor: themeColor }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to {confirmAction.action} this user?
              {confirmAction.action === "suspend" &&
                " This will immediately log them out and prevent access."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  handleSuspendToggle(
                    confirmAction.userId,
                    confirmAction.action === "unsuspend"
                  )
                }
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  backgroundColor: themeColor,
                  color: "black",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersTable;
