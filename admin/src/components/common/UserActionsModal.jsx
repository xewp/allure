import React from "react";

/**
 * UserActionsModal - Displays available actions for a selected user
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {Object} props.user - The selected user object
 * @param {string} props.adminRole - Current admin's role ('admin' or 'superadmin')
 * @param {function} props.onEditUser - Callback to edit user
 * @param {function} props.onToggleModelAccess - Callback to toggle model access
 * @param {function} props.onDeleteUser - Callback to delete user
 * @param {function} props.onSuspendUser - Callback to suspend/unsuspend user
 */
const UserActionsModal = ({
  isOpen,
  onClose,
  user,
  adminRole,
  onEditUser,
  onToggleModelAccess,
  onDeleteUser,
  onSuspendUser,
}) => {
  const themeColor = "#d6b48e";

  if (!isOpen || !user) return null;

  const isSuperAdmin = adminRole === "superadmin";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2"
        style={{ borderColor: themeColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold" style={{ color: themeColor }}>
            User Actions
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 pb-6 border-b border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Selected User</p>
          <p className="text-white text-lg font-semibold">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username}
          </p>
          <p className="text-gray-400 text-sm">@{user.username}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Super Admin Only: Edit User */}
          {isSuperAdmin && (
            <button
              onClick={() => {
                onEditUser();
                onClose();
              }}
              className="w-full py-3 rounded-xl border-2 text-white font-semibold transition-all hover:text-black"
              style={{ borderColor: themeColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ✏️ Edit User
            </button>
          )}

          {/* Super Admin Only: Toggle Model Access */}
          {isSuperAdmin && (
            <button
              onClick={() => {
                onToggleModelAccess();
                onClose();
              }}
              className={`w-full py-3 rounded-xl border-2 font-semibold transition-all ${
                user.canViewModels !== false
                  ? "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  : "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
              }`}
            >
              {user.canViewModels !== false
                ? "🔓 Disable Model Access"
                : "🔒 Enable Model Access"}
            </button>
          )}

          {/* Super Admin Only: Delete User */}
          {isSuperAdmin && (
            <button
              onClick={() => {
                onDeleteUser();
                onClose();
              }}
              className="w-full py-3 rounded-xl border-2 border-red-500 text-red-500 font-semibold transition-all hover:bg-red-500 hover:text-white"
            >
              🗑️ Delete User
            </button>
          )}

          {/* All Admins: Suspend/Unsuspend User */}
          <button
            onClick={() => {
              onSuspendUser();
              onClose();
            }}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              user.suspended
                ? "border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                : "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            }`}
          >
            {user.suspended ? "✓ Unsuspend User" : "⚠️ Suspend User"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border-2 border-gray-600 text-gray-400 font-semibold transition-all hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
