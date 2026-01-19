import React, { useState, useEffect } from "react";
import API_URL from "../config/api";
import useModal from "../hooks/useModal.jsx";
import UserActionsModal from "../components/common/UserActionsModal";

const AdminUsers = () => {
  const { Modal, showSuccess, showError, showConfirm } = useModal();
  const themeColor = "#d6b48e";

  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [adminRole, setAdminRole] = useState("admin");

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
  });

  // Model details state for favorites
  const [selectedModelDetails, setSelectedModelDetails] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Unable to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    // Get admin role from localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setAdminRole(user.role || "admin");
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter((user) => {
        return (
          user.username?.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Delete user
  const handleDeleteUser = async (userId) => {
    showConfirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
      async () => {
        try {
          const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: "DELETE",
          });
          const data = await response.json();

          if (data.success) {
            fetchUsers();
            setSelectedUser(null);
            showSuccess("User deleted successfully");
          } else {
            showError(data.message || "Failed to delete user");
          }
        } catch (err) {
          console.error("Error deleting user:", err);
          showError("Unable to connect to server");
        }
      },
    );
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      age: user.age || "",
    });
    setSelectedUser(null); // Close view details modal
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      if (data.success) {
        fetchUsers();
        setEditingUser(null);
        showSuccess("User updated successfully");
      } else {
        showError(data.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showError("Unable to connect to server");
    }
  };

  // Suspend/Unsuspend user
  const handleSuspendUser = async (userId, currentStatus) => {
    const action = currentStatus ? "unsuspend" : "suspend";
    showConfirm(
      `Are you sure you want to ${action} this user?${!currentStatus ? " This will prevent them from accessing the platform." : ""}`,
      async () => {
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
            },
          );
          const data = await response.json();

          if (data.success) {
            fetchUsers();
            setSelectedUser(null);
            setActionModalOpen(false);
            showSuccess(data.message || `User ${action}ed successfully`);
          } else {
            showError(data.message || `Failed to ${action} user`);
          }
        } catch (err) {
          console.error(`Error ${action}ing user:`, err);
          showError("Unable to connect to server");
        }
      },
      "Confirm Action",
    );
  };

  // Toggle Model Access (Superadmin only)
  const handleToggleModelAccess = async (userId, currentStatus) => {
    const action = currentStatus ? "disable" : "enable";
    showConfirm(
      `Are you sure you want to ${action} model access for this user?`,
      async () => {
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
            setSelectedUser(null);
            setActionModalOpen(false);
            showSuccess(`Model access ${action}d successfully!`);
          } else {
            showError(data.message || `Failed to ${action} model access`);
          }
        } catch (err) {
          console.error(`Error ${action}ing model access:`, err);
          showError("Unable to connect to server");
        }
      },
      "Confirm Action",
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Fetch model details for favorites
  const fetchModelDetails = async (modelId, category) => {
    try {
      setModelLoading(true);

      // Use the simple /models/:id endpoint
      const response = await fetch(`${API_URL}/models/${modelId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedModelDetails(data);
      } else {
        console.error("Failed to fetch model details");
      }
    } catch (error) {
      console.error("Error fetching model details:", error);
    } finally {
      setModelLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: themeColor }}
          >
            User Management
          </h1>
          <p className="text-gray-400">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"} registered
          </p>
        </div>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 rounded-full bg-gray-900 border text-white outline-none focus:ring-2"
          style={{ borderColor: themeColor }}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-500 rounded-lg text-white">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div
        className="bg-black border rounded-2xl overflow-hidden"
        style={{ borderColor: themeColor }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: themeColor }}>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  User ID
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Name
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Username
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Email
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Phone
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Age
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Joined
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Favorites
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: themeColor }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-800 hover:bg-gray-900 hover:bg-opacity-30 transition-all"
                  >
                    <td className="p-4 text-white">#{index + 1}</td>
                    <td className="p-4 text-white font-semibold">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "N/A"}
                    </td>
                    <td className="p-4 text-white">{user.username}</td>
                    <td className="p-4 text-white">{user.email || "N/A"}</td>
                    <td className="p-4 text-white">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="p-4 text-white">{user.age || "N/A"}</td>
                    <td className="p-4 text-white">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">❤️</span>
                        <span className="text-white font-semibold">
                          {user.favorites?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 rounded-lg border text-white text-sm font-semibold transition-all hover:text-black"
                        style={{ borderColor: themeColor }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6 animate-fade-in"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-black border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
            style={{ borderColor: themeColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: themeColor }}>
                User Details
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white hover:text-red-500 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">First Name</p>
                  <p className="text-white text-lg font-semibold">
                    {selectedUser.firstName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Name</p>
                  <p className="text-white text-lg font-semibold">
                    {selectedUser.lastName || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-white text-xl font-semibold">
                  {selectedUser.username}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white text-lg">
                  {selectedUser.email || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Phone Number</p>
                  <p className="text-white text-lg">
                    {selectedUser.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Age</p>
                  <p className="text-white text-lg">
                    {selectedUser.age || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Joined Date</p>
                <p className="text-white text-lg">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  Favorite Models ({selectedUser.favorites?.length || 0})
                </p>
                {selectedUser.favorites && selectedUser.favorites.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.favorites.map((favorite, index) => (
                      <span
                        key={index}
                        onClick={() =>
                          fetchModelDetails(favorite.modelId, favorite.category)
                        }
                        className="px-3 py-1 rounded-full text-black text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: themeColor }}
                      >
                        {favorite.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No favorites yet</p>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setActionModalOpen(true)}
                className="px-8 py-3 rounded-full border-2 text-white font-semibold transition-all hover:text-black"
                style={{ borderColor: themeColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Manage User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6 animate-fade-in"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="bg-black border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
            style={{ borderColor: themeColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: themeColor }}>
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-white hover:text-red-500 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {/* Edit Form */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none focus:ring-2"
                    style={{ focusRingColor: themeColor }}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none focus:ring-2"
                    style={{ focusRingColor: themeColor }}
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none focus:ring-2"
                  style={{ focusRingColor: themeColor }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phoneNumber: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none focus:ring-2"
                    style={{ focusRingColor: themeColor }}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Age
                  </label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: e.target.value })
                    }
                    min="18"
                    max="120"
                    className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none focus:ring-2"
                    style={{ focusRingColor: themeColor }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdateUser}
                className="flex-1 py-3 rounded-full border text-white font-semibold transition-all hover:text-black"
                style={{ borderColor: themeColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-3 rounded-full border border-gray-500 text-gray-400 font-semibold transition-all hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Details Modal for Favorites - Matching AdminBookings format */}
      {(selectedModelDetails || modelLoading) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6 animate-fade-in"
          onClick={() => !modelLoading && setSelectedModelDetails(null)}
        >
          <div
            className="bg-black border rounded-3xl p-8 max-w-lg w-full relative animate-fade-in-up"
            style={{ borderColor: themeColor }}
            onClick={(e) => e.stopPropagation()}
          >
            {modelLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div
                  className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-4"
                  style={{
                    borderColor: `${themeColor} transparent transparent transparent`,
                  }}
                ></div>
                <p className="text-white">Loading model details...</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setSelectedModelDetails(null)}
                  className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl font-bold"
                >
                  ×
                </button>
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="w-40 h-40 rounded-full overflow-hidden mb-4 border-2"
                    style={{ borderColor: themeColor }}
                  >
                    <img
                      src={selectedModelDetails.imageUrl}
                      alt={selectedModelDetails.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: themeColor }}
                  >
                    {selectedModelDetails.name}
                  </h3>
                  <span className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                    {selectedModelDetails.category === "foreign"
                      ? "FOREIGN"
                      : "LOCAL"}
                  </span>
                  <p
                    className={`text-sm font-semibold ${
                      selectedModelDetails.available
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {selectedModelDetails.available
                      ? "✓ Available"
                      : "✗ Unavailable"}
                  </p>
                </div>

                {selectedModelDetails.galleryImages &&
                  selectedModelDetails.galleryImages.length > 0 && (
                    <div className="mt-6">
                      <p className="text-gray-400 text-sm mb-3 text-center">
                        Gallery
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedModelDetails.galleryImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden border"
                            style={{ borderColor: themeColor }}
                          >
                            <img
                              src={img}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      )}

      {/* User Actions Modal */}
      <UserActionsModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        user={selectedUser}
        adminRole={adminRole}
        onEditUser={() => handleEditClick(selectedUser)}
        onToggleModelAccess={() =>
          handleToggleModelAccess(
            selectedUser._id,
            selectedUser.canViewModels !== false,
          )
        }
        onDeleteUser={() => handleDeleteUser(selectedUser._id)}
        onSuspendUser={() =>
          handleSuspendUser(selectedUser._id, selectedUser.suspended)
        }
      />

      {/* Global Modal */}
      {Modal}
    </div>
  );
};

export default AdminUsers;
