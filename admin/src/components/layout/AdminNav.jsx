import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminNav = () => {
  const themeColor = "#d6b48e";
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    // Check if user is superadmin
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsSuperadmin(decoded.role === "superadmin");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Users", icon: "👥" },
    { path: "/models", label: "Models", icon: "✨" },
    { path: "/bookings", label: "Bookings", icon: "📅" },
    { path: "/upload", label: "Upload", icon: "⬆️" },
  ];

  const superadminNavItems = [
    { path: "/superadmin/dashboard", label: "SA Dashboard", icon: "🔧" },
    { path: "/superadmin/users", label: "All Users", icon: "👥" },
    { path: "/superadmin/model-approvals", label: "Approvals", icon: "✅" },
    { path: "/superadmin/settings", label: "Settings", icon: "⚙️" },
    { path: "/superadmin/logs", label: "Admin Logs", icon: "📋" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      className="h-screen w-64 bg-black border-r flex flex-col"
      style={{ borderColor: themeColor }}
    >
      {/* Logo/Title */}
      <div className="p-6 border-b" style={{ borderColor: themeColor }}>
        <h1 className="text-2xl font-bold" style={{ color: themeColor }}>
          Power Allure
        </h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        {isSuperadmin && (
          <div
            className="mt-3 px-3 py-1 rounded-full text-xs font-bold text-center"
            style={{ backgroundColor: themeColor, color: "black" }}
          >
            🔑 SUPERADMIN
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 overflow-y-auto">
        {/* Regular Admin Nav */}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-all ${
                isActive
                  ? "text-black font-semibold"
                  : "text-white hover:text-black"
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? themeColor : "transparent",
            })}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Superadmin Section */}
        {isSuperadmin && (
          <>
            <div className="px-6 py-3 mt-4 mb-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Superadmin
              </div>
            </div>
            {superadminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-all ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-white hover:text-black"
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? themeColor : "transparent",
                })}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t" style={{ borderColor: themeColor }}>
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-full border text-white font-semibold transition-all hover:text-black"
          style={{ borderColor: themeColor }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;
