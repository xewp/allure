import React, { useState, useEffect } from "react";
import API_URL from "../config/api";
import useModal from "../hooks/useModal.jsx";

const AllUsersTable = () => {
  const { Modal, showSuccess, showError } = useModal();
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
        },
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

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/admin/approve-user/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        showSuccess("User approved successfully!");
      } else {
        showError(data.message || "Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      showError("Error approving user");
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/admin/reject-user/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        showSuccess("User rejected successfully");
      } else {
        showError(data.message || "Failed to reject user");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      showError("Error rejecting user");
    }
  };

  const handleToggleModelAccess = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/admin/toggle-model-access/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        showSuccess(
          `Model access ${currentStatus ? "disabled" : "enabled"} successfully!`,
        );
      } else {
        showError(data.message || "Failed to toggle model access");
      }
    } catch (error) {
      console.error("Error toggling model access:", error);
      showError("Error toggling model access");
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
          User Registration Approval
        </h1>
        <p className="text-gray-400">
          Approve or reject new user registrations
        </p>
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
                Approval Status
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
                    {user.approvalStatus === "pending" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-900 text-yellow-200">
                        Pending
                      </span>
                    )}
                    {user.approvalStatus === "approved" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-900 text-green-200">
                        Approved
                      </span>
                    )}
                    {user.approvalStatus === "rejected" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-900 text-red-200">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {user.approvalStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(user._id)}
                            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {user.approvalStatus === "approved" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-900 text-green-200">
                          Approved
                        </span>
                      )}
                      {user.approvalStatus === "rejected" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-red-900 text-red-200">
                          Rejected
                        </span>
                      )}
                    </div>
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

      {/* Global Modal */}
      {Modal}
    </div>
  );
};

export default AllUsersTable;
