import React, { useState, useEffect } from "react";
import API_URL from "../config/api";
import useModal from "../hooks/useModal.jsx";

const ModelApprovalList = () => {
  const { Modal, showSuccess, showError } = useModal();
  const themeColor = "#d6b48e";
  const [pendingModels, setPendingModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchPendingModels();
  }, []);

  const fetchPendingModels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/superadmin/models/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setPendingModels(data.models);
      }
    } catch (error) {
      console.error("Error fetching pending models:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (modelId, category) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/superadmin/models/${modelId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category }),
        },
      );

      const data = await response.json();

      if (data.success) {
        showSuccess("Model approved successfully!");
        fetchPendingModels();
      } else {
        showError(data.message || "Failed to approve model");
      }
    } catch (error) {
      console.error("Error approving model:", error);
      showError("Error approving model");
    }
  };

  const handleReject = async (modelId, category) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/superadmin/models/${modelId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category }),
        },
      );

      const data = await response.json();

      if (data.success) {
        showSuccess("Model rejected successfully!");
        fetchPendingModels();
      } else {
        showError(data.message || "Failed to reject model");
      }
    } catch (error) {
      console.error("Error rejecting model:", error);
      showError("Error rejecting model");
    }
  };

  const handleToggleFeatured = async (modelId, category, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/superadmin/models/${modelId}/featured`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category }),
        },
      );

      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        window.location.reload();
      } else {
        showError(data.message || "Failed to update featured status");
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      showError("Error updating featured status");
    }
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
          Model Approvals
        </h1>
        <p className="text-gray-400">
          Review and approve pending model applications
        </p>
      </div>

      {/* Pending Count */}
      <div className="mb-6 text-gray-400">
        Pending Models: {pendingModels.length}
      </div>

      {/* Models Grid */}
      {pendingModels.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">No pending model approvals</p>
          <p className="mt-2">All models have been reviewed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingModels.map((model) => (
            <div
              key={model._id}
              className="bg-gray-900 rounded-2xl overflow-hidden border"
              style={{ borderColor: themeColor }}
            >
              {/* Model Image */}
              <div className="relative h-64 bg-gray-800">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: themeColor,
                      color: "black",
                    }}
                  >
                    {model.category}
                  </span>
                </div>
              </div>

              {/* Model Info */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  {model.name}
                </h3>
                <p className="text-gray-400 text-sm mb-1">Age: {model.age}</p>
                <p className="text-gray-400 text-sm mb-1">
                  Height: {model.height}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  Weight: {model.weight}
                </p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {model.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(model._id, model.category)}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(model._id, model.category)}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                  >
                    Reject
                  </button>
                </div>

                <button
                  onClick={() => setSelectedModel(model)}
                  className="w-full mt-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-[#d6b48e] transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model Details Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
            style={{ borderColor: themeColor }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">
                {selectedModel.name}
              </h3>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <img
              src={selectedModel.imageUrl}
              alt={selectedModel.name}
              className="w-full h-96 object-cover rounded-xl mb-4"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x800?text=No+Image";
              }}
            />

            <div className="space-y-3 text-gray-300">
              <p>
                <strong>Category:</strong> {selectedModel.category}
              </p>
              <p>
                <strong>Age:</strong> {selectedModel.age}
              </p>
              <p>
                <strong>Height:</strong> {selectedModel.height}
              </p>
              <p>
                <strong>Weight:</strong> {selectedModel.weight}
              </p>
              <p>
                <strong>Description:</strong> {selectedModel.description}
              </p>
              <p>
                <strong>Available:</strong>{" "}
                {selectedModel.available ? "Yes" : "No"}
              </p>
            </div>

            {/* Gallery Images */}
            {selectedModel.galleryImages &&
              selectedModel.galleryImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-white mb-3">Gallery</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedModel.galleryImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  handleApprove(selectedModel._id, selectedModel.category);
                  setSelectedModel(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleReject(selectedModel._id, selectedModel.category);
                  setSelectedModel(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modal */}
      {Modal}
    </div>
  );
};

export default ModelApprovalList;
