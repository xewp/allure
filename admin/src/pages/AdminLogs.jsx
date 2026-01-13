import React, { useState, useEffect } from "react";
import API_URL from "../config/api";
import LogDetailsModal from "../components/LogDetailsModal";

const AdminLogs = () => {
  const themeColor = "#d6b48e";
  const [logs, setLogs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    adminId: "",
    action: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchAdmins();
    fetchLogs();
  }, [pagination.page, filters.adminId, filters.action]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/superadmin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.adminId && { adminId: filters.adminId }),
        ...(filters.action && { action: filters.action }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(
        `${API_URL}/api/superadmin/logs?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action) => {
    if (action.includes("approve")) return "✅";
    if (action.includes("reject")) return "❌";
    if (action.includes("suspend")) return "🚫";
    if (action.includes("unsuspend")) return "✔️";
    if (action.includes("featured")) return "⭐";
    if (action.includes("delete")) return "🗑️";
    if (action.includes("update")) return "✏️";
    if (action.includes("create")) return "➕";
    return "📝";
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
          Admin Logs
        </h1>
        <p className="text-gray-400">Track all admin actions and changes</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Admin Filter */}
        <select
          value={filters.adminId}
          onChange={(e) => handleFilterChange("adminId", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
        >
          <option value="">All Admins</option>
          {admins.map((admin) => (
            <option key={admin._id} value={admin._id}>
              {admin.username} ({admin.role})
            </option>
          ))}
        </select>

        {/* Action Filter */}
        <select
          value={filters.action}
          onChange={(e) => handleFilterChange("action", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
        >
          <option value="">All Actions</option>
          <option value="approved_model">Approved Model</option>
          <option value="rejected_model">Rejected Model</option>
          <option value="suspended_user">Suspended User</option>
          <option value="unsuspended_user">Unsuspended User</option>
          <option value="featured_model">Featured Model</option>
          <option value="unfeatured_model">Unfeatured Model</option>
          <option value="updated_system_settings">Updated Settings</option>
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
        />

        {/* End Date */}
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
        />
      </div>

      {/* Logs Count */}
      <div className="mb-4 text-gray-400">Total Logs: {pagination.total}</div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: themeColor }}>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Timestamp
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Admin
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Action
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Target
              </th>
              <th className="text-left p-4 text-gray-400 font-semibold">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <td className="p-4 text-gray-300">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="p-4">
                    <div className="text-white">
                      {log.adminId?.username || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.adminId?.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 text-white">
                      <span>{getActionIcon(log.action)}</span>
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {log.targetName || "N/A"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-[#d6b48e] transition-colors text-sm"
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

      {/* Log Details Modal */}
      {selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default AdminLogs;
