import React from "react";
import useModal from "../hooks/useModal.jsx";

const LogDetailsModal = ({ log, onClose }) => {
  const { showSuccess } = useModal();
  const themeColor = "#d6b48e";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
        style={{ borderColor: themeColor }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-white">Log Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Log Information */}
        <div className="space-y-4">
          {/* Timestamp */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Timestamp</div>
            <div className="text-white font-semibold">
              {formatTimestamp(log.timestamp)}
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Admin</div>
            <div className="text-white font-semibold">
              {log.adminId?.username || log.adminName || "Unknown"}
            </div>
            {log.adminId?.email && (
              <div className="text-gray-400 text-sm mt-1">
                {log.adminId.email}
              </div>
            )}
            {log.adminId?.role && (
              <div
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: themeColor,
                  color: "black",
                }}
              >
                {log.adminId.role}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Action</div>
            <div className="text-white font-semibold">
              {log.action.replace(/_/g, " ")}
            </div>
          </div>

          {/* Target */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Target</div>
            <div className="text-white font-semibold">
              {log.targetName || "N/A"}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Type: {log.targetType}
            </div>
            {log.targetId && (
              <div className="text-gray-500 text-xs mt-1 font-mono">
                ID: {log.targetId}
              </div>
            )}
          </div>

          {/* IP Address */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">IP Address</div>
            <div className="text-white font-mono">
              {log.ipAddress || "Unknown"}
            </div>
          </div>

          {/* Additional Details */}
          {log.details && Object.keys(log.details).length > 0 && (
            <div className="p-4 rounded-xl bg-black border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400 text-sm">Additional Details</div>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(log.details, null, 2))
                  }
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="text-white text-sm overflow-x-auto bg-gray-950 p-3 rounded-lg">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}

          {/* Log ID */}
          <div className="p-4 rounded-xl bg-black border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Log ID</div>
            <div className="text-gray-500 text-xs font-mono">{log._id}</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl font-semibold transition-all"
            style={{
              backgroundColor: themeColor,
              color: "black",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailsModal;
