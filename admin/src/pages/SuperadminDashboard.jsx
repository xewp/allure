import React, { useState, useEffect } from "react";
import API_URL from "../config/api";

const SuperadminDashboard = () => {
  const themeColor = "#d6b48e";
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/superadmin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentLogs(data.recentLogs);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: themeColor }}
        >
          Superadmin Dashboard
        </h1>
        <p className="text-gray-400">Platform Overview & Administration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="bg-black border rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          style={{ borderColor: themeColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-white">
            {stats?.totalUsers || 0}
          </p>
          {stats?.suspendedUsers > 0 && (
            <p className="text-red-400 text-xs mt-2">
              {stats.suspendedUsers} suspended
            </p>
          )}
        </div>

        <div
          className="bg-black border rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          style={{ borderColor: themeColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">✨</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Total Models</h3>
          <p className="text-3xl font-bold text-white">
            {stats?.totalModels || 0}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {stats?.featuredModels || 0} featured
          </p>
        </div>

        <div
          className="bg-black border rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          style={{ borderColor: themeColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">⏳</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Pending Approvals</h3>
          <p className="text-3xl font-bold text-white">
            {stats?.pendingModels || 0}
          </p>
          <p className="text-gray-400 text-xs mt-2">Models awaiting review</p>
        </div>

        <div
          className="bg-black border rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          style={{ borderColor: themeColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">🔧</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Platform Status</h3>
          <p className="text-3xl font-bold text-green-400">Online</p>
          <p className="text-gray-400 text-xs mt-2">All systems operational</p>
        </div>
      </div>

      {/* Recent Admin Activity */}
      <div
        className="bg-black border rounded-2xl p-6"
        style={{ borderColor: themeColor }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: themeColor }}>
            Recent Admin Activity
          </h2>
          <button
            onClick={() => (window.location.href = "/superadmin/logs")}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            View All Logs
          </button>
        </div>

        <div className="space-y-4">
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              No recent activity
            </p>
          ) : (
            recentLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-900 bg-opacity-30 transition-all hover:bg-opacity-50"
              >
                <div
                  className="w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <div className="flex-1">
                  <p className="text-white">
                    <span style={{ color: themeColor }}>
                      {log.adminId?.username || "Admin"}
                    </span>{" "}
                    {log.action.replace(/_/g, " ")}
                    {log.targetName && (
                      <span className="text-gray-400"> - {log.targetName}</span>
                    )}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatTimeAgo(log.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <button
          onClick={() => (window.location.href = "/superadmin/users")}
          className="p-4 rounded-xl border text-white font-semibold transition-all hover:text-black"
          style={{ borderColor: themeColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span className="text-2xl mr-2">👥</span> Manage Users
        </button>

        <button
          onClick={() => (window.location.href = "/superadmin/model-approvals")}
          className="p-4 rounded-xl border text-white font-semibold transition-all hover:text-black"
          style={{ borderColor: themeColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span className="text-2xl mr-2">✅</span> Model Approvals
        </button>

        <button
          onClick={() => (window.location.href = "/superadmin/settings")}
          className="p-4 rounded-xl border text-white font-semibold transition-all hover:text-black"
          style={{ borderColor: themeColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span className="text-2xl mr-2">⚙️</span> System Settings
        </button>

        <button
          onClick={() => (window.location.href = "/superadmin/logs")}
          className="p-4 rounded-xl border text-white font-semibold transition-all hover:text-black"
          style={{ borderColor: themeColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span className="text-2xl mr-2">📋</span> Admin Logs
        </button>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
