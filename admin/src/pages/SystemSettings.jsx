import React, { useState, useEffect } from "react";
import API_URL from "../config/api";
import useModal from "../hooks/useModal.jsx";

const SystemSettings = () => {
  const { Modal, showSuccess, showError } = useModal();
  const themeColor = "#d6b48e";
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    default_commission_percentage: 20,
    enableSignup: true, // Changed from enable_signups to match backend
    announcement_banner: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/superadmin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        // Convert settings object to our state format
        const settingsObj = {};
        Object.keys(data.settings).forEach((key) => {
          settingsObj[key] = data.settings[key].value;
        });
        setSettings(settingsObj);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/superadmin/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess("Settings saved successfully!");
      } else {
        showError(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showError("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleInputChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
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
          System Settings
        </h1>
        <p className="text-gray-400">Configure platform-wide settings</p>
      </div>

      {/* Settings Panel */}
      <div
        className="bg-gray-900 rounded-2xl border p-6 max-w-3xl"
        style={{ borderColor: themeColor }}
      >
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-gray-800">
            <div>
              <h3 className="text-lg font-bold text-white">Maintenance Mode</h3>
              <p className="text-gray-400 text-sm">
                Enable to prevent users from accessing the platform
              </p>
            </div>
            <button
              onClick={() => handleToggle("maintenance_mode")}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                settings.maintenance_mode ? "bg-red-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.maintenance_mode ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Enable Signups */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-gray-800">
            <div>
              <h3 className="text-lg font-bold text-white">Enable Signups</h3>
              <p className="text-gray-400 text-sm">
                Allow new users to register on the platform
              </p>
            </div>
            <button
              onClick={() => handleToggle("enableSignup")}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                settings.enableSignup ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.enableSignup ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Default Commission Percentage */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-2">
              Default Commission Percentage
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Default commission rate for bookings
            </p>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.default_commission_percentage}
              onChange={(e) =>
                handleInputChange(
                  "default_commission_percentage",
                  parseFloat(e.target.value),
                )
              }
              className="w-32 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
            />
            <span className="text-white ml-2">%</span>
          </div>

          {/* Announcement Banner */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-2">
              Announcement Banner
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Display an announcement message across the platform
            </p>
            <textarea
              value={settings.announcement_banner}
              onChange={(e) =>
                handleInputChange("announcement_banner", e.target.value)
              }
              placeholder="Enter announcement text (leave empty to hide)"
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#d6b48e]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
            style={{
              backgroundColor: themeColor,
              color: "black",
            }}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Warning Section */}
      <div className="mt-8 p-6 rounded-xl bg-yellow-900 bg-opacity-20 border border-yellow-600 max-w-3xl">
        <h3 className="text-yellow-400 font-bold mb-2">⚠️ Important Notice</h3>
        <ul className="text-yellow-200 text-sm space-y-1 list-disc list-inside">
          <li>
            Maintenance mode will immediately block all users from accessing the
            platform
          </li>
          <li>Disabling signups will prevent new user registrations</li>
          <li>
            Commission changes only affect new bookings, not existing ones
          </li>
          <li>All settings changes are logged and can be audited</li>
        </ul>
      </div>

      {/* Global Modal */}
      {Modal}
    </div>
  );
};

export default SystemSettings;
