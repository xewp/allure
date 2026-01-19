import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config/api";
import AdminModal from "../components/common/AdminModal";
import useModal from "../hooks/useModal.jsx";

const AdminModels = () => {
  const { showError } = useModal();
  const themeColor = "#d6b48e";
  const [activeTab, setActiveTab] = useState("local");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Likes Modal State
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesData, setLikesData] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [currentModelName, setCurrentModelName] = useState("");

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminModalConfig, setAdminModalConfig] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    description: "",
    available: true,
  });

  // Fetch models from database
  const fetchModels = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "local"
          ? "/models/local?showAll=true"
          : "/models/foreign?showAll=true";
      const response = await axios.get(`${API_URL}${endpoint}`);
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
      setAdminModalConfig({
        title: "Error",
        message: "Failed to load models. Please try again.",
        type: "error",
      });
      setShowAdminModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch models when tab changes
  useEffect(() => {
    fetchModels();
  }, [activeTab]);

  // Open edit modal
  const handleEdit = (model) => {
    setEditingModel(model);
    setFormData({
      name: model.name || "",
      age: model.age || "",
      height: model.height || "",
      weight: model.weight || "",
      description: model.description || "",
      available: model.available !== undefined ? model.available : true,
    });
    setShowEditModal(true);
  };

  // Open likes modal
  const handleViewLikes = async (model) => {
    setCurrentModelName(model.name);
    setShowLikesModal(true);
    setLoadingLikes(true);
    try {
      const response = await axios.get(`${API_URL}/models/${model._id}/likes`);
      if (response.data.success) {
        setLikesData(response.data.users);
      } else {
        showError("Failed to load likes");
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
      showError("Failed to load likes");
    } finally {
      setLoadingLikes(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/models/${editingModel._id}`, formData);
      setAdminModalConfig({
        title: "Success",
        message: "Model updated successfully!",
        type: "success",
      });
      setShowAdminModal(true);
      setShowEditModal(false);
      setEditingModel(null);
      fetchModels(); // Refresh the list
    } catch (error) {
      console.error("Error updating model:", error);
      setAdminModalConfig({
        title: "Error",
        message: "Failed to update model. Please try again.",
        type: "error",
      });
      setShowAdminModal(true);
    }
  };

  // Delete model
  const handleDelete = async (modelId, modelName) => {
    // Use modal for confirmation
    setAdminModalConfig({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${modelName}"? This action cannot be undone.`,
      type: "warning",
      confirmText: "Delete",
      showCancel: true,
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/models/${modelId}`);
          setAdminModalConfig({
            title: "Success",
            message: "Model deleted successfully!",
            type: "success",
          });
          setShowAdminModal(true);
          fetchModels(); // Refresh the list
        } catch (error) {
          console.error("Error deleting model:", error);
          setAdminModalConfig({
            title: "Error",
            message: "Failed to delete model. Please try again.",
            type: "error",
          });
          setShowAdminModal(true);
        }
      },
    });
    setShowAdminModal(true);
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: themeColor }}
        >
          Model Management
        </h1>
        <p className="text-gray-400">
          View and manage all models in your platform
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("local")}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            activeTab === "local" ? "text-black" : "text-white border"
          }`}
          style={{
            backgroundColor: activeTab === "local" ? themeColor : "transparent",
            borderColor: themeColor,
          }}
        >
          Local Models
        </button>
        <button
          onClick={() => setActiveTab("foreign")}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            activeTab === "foreign" ? "text-black" : "text-white border"
          }`}
          style={{
            backgroundColor:
              activeTab === "foreign" ? themeColor : "transparent",
            borderColor: themeColor,
          }}
        >
          Foreign Models
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-white text-xl">Loading models...</div>
        </div>
      ) : models.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-400 text-xl">
              No models found in this collection
            </p>
            <p className="text-gray-500 mt-2">
              Upload models using the Upload page
            </p>
          </div>
        </div>
      ) : (
        /* Models Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <div
              key={model._id}
              className="bg-black border rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
              style={{ borderColor: themeColor }}
            >
              {/* Model Image */}
              <div className="w-full h-80 bg-gray-800 relative group">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Button for Likes */}
                <button
                  onClick={() => handleViewLikes(model)}
                  className="absolute top-4 right-4 bg-black bg-opacity-70 p-2 rounded-full text-white hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                  title="View Users who Liked"
                >
                  ❤️{" "}
                  <span className="text-xs font-bold">
                    {model.favoritesCount || 0}
                  </span>
                </button>
              </div>

              {/* Model Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{model.name}</h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        model.available ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-gray-400 text-xs">
                      {model.available ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Data Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                  <div>Height: {model.height}</div>
                  <div>Weight: {model.weight}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(model)}
                    className="flex-1 py-2 rounded-lg border text-white text-sm font-semibold transition-all hover:text-black"
                    style={{ borderColor: themeColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(model._id, model.name)}
                    className="flex-1 py-2 rounded-lg border border-red-500 text-red-500 text-sm font-semibold transition-all hover:bg-red-500 hover:text-white"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-black border rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ borderColor: themeColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: themeColor }}>
                Edit Model
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white hover:text-red-500 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image Preview */}
              <div>
                <div
                  className="border-2 rounded-2xl overflow-hidden mb-4"
                  style={{ borderColor: themeColor }}
                >
                  <img
                    src={editingModel.imageUrl}
                    alt={editingModel.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Model ID: {editingModel._id}
                </p>
              </div>

              {/* Right Column - Edit Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-transparent border-2 rounded-xl p-3 text-white outline-none focus:border-opacity-100 transition-all"
                    style={{ borderColor: themeColor }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm block mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full bg-transparent border-2 rounded-xl p-3 text-white outline-none focus:border-opacity-100 transition-all"
                      style={{ borderColor: themeColor }}
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm block mb-2">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full bg-transparent border-2 rounded-xl p-3 text-white outline-none focus:border-opacity-100 transition-all"
                      style={{ borderColor: themeColor }}
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm block mb-2">
                      Height
                    </label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="w-full bg-transparent border-2 rounded-xl p-3 text-white outline-none focus:border-opacity-100 transition-all"
                      style={{ borderColor: themeColor }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm block mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="4"
                    className="w-full bg-transparent border-2 rounded-xl p-3 text-white outline-none focus:border-opacity-100 transition-all resize-none"
                    style={{ borderColor: themeColor }}
                  />
                </div>

                {/* Removed Favorites Count Input as requested */}

                <div
                  className="flex items-center justify-between p-4 border-2 rounded-xl"
                  style={{ borderColor: themeColor }}
                >
                  <div>
                    <label className="text-white text-sm block mb-1">
                      Availability
                    </label>
                    <p className="text-gray-400 text-xs">
                      Unavailable models won't show on client
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.available}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          available: e.target.checked,
                        })
                      }
                    />
                    <div
                      className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"
                      style={{
                        backgroundColor: formData.available
                          ? themeColor
                          : "#374151",
                      }}
                    ></div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-full text-black font-bold transition-all hover:scale-105"
                    style={{ backgroundColor: themeColor }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 rounded-full border text-white font-bold transition-all hover:bg-gray-800"
                    style={{ borderColor: themeColor }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
          onClick={() => setShowLikesModal(false)}
        >
          <div
            className="bg-black border rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            style={{ borderColor: themeColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold" style={{ color: themeColor }}>
                  Users who liked
                </h3>
                <p className="text-white text-lg">{currentModelName}</p>
              </div>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-white hover:text-red-500 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {loadingLikes ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : likesData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">💔</p>
                No likes yet
              </div>
            ) : (
              <div className="space-y-3">
                {likesData.map((user) => (
                  <div
                    key={user._id}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-bold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Liked on</p>
                      <p className="text-gray-300 text-sm">
                        {new Date(user.likedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        title={adminModalConfig.title}
        message={adminModalConfig.message}
        type={adminModalConfig.type}
        confirmText={adminModalConfig.confirmText}
        onConfirm={adminModalConfig.onConfirm}
        showCancel={adminModalConfig.showCancel}
        onCancel={adminModalConfig.onCancel}
      />
    </div>
  );
};

export default AdminModels;
