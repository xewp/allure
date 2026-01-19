import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";
import useModal from "../hooks/useModal.jsx";

const AdminUpload = () => {
  const { Modal, showSuccess, showError, showWarning } = useModal();
  const themeColor = "#d6b48e";
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [collection, setCollection] = useState("local"); // 'local' or 'foreign'
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    description: "",
    height: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle main image selection and preview
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
    }
  };

  // Handle gallery images selection and preview
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);

    // Create preview URLs for all gallery images
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  // Remove main image preview
  const removeMainImage = () => {
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(null);
    setMainImagePreview(null);
  };

  // Remove specific gallery image
  const removeGalleryImage = (index) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!mainImage) return showWarning("Please select a main image");
    setLoading(true);

    try {
      // 1. Convert Main Image to base64
      const mainImageBase64 = await fileToBase64(mainImage);

      // 2. Convert Gallery Images to base64
      const galleryBase64 = [];
      if (galleryFiles.length > 0) {
        const convertPromises = galleryFiles.map((file) => fileToBase64(file));
        const results = await Promise.all(convertPromises);
        galleryBase64.push(...results);
      }

      // 3. Save to MongoDB with appropriate endpoint
      const finalData = {
        ...formData,
        imageUrl: mainImageBase64,
        galleryImages: galleryBase64,
      };

      const endpoint =
        collection === "local"
          ? `${API_URL}/models/local`
          : `${API_URL}/models/foreign`;

      await axios.post(endpoint, finalData);

      showSuccess(
        `${
          collection === "local" ? "Local" : "Foreign"
        } talent saved successfully!`,
      );

      // Reset form
      setFormData({
        name: "",
        age: "",
        description: "",
        height: "",
        weight: "",
      });
      removeMainImage();
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
      setGalleryFiles([]);
      setGalleryPreviews([]);
    } catch (error) {
      console.error(error);
      showError("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: themeColor }}
        >
          Upload Model
        </h1>
        <p className="text-gray-400">
          Add new talent with profile and gallery images
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          <form onSubmit={handleUpload} className="space-y-6">
            {/* Collection Selection */}
            <div>
              <label className="text-white text-sm block mb-3">
                Collection Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCollection("local")}
                  className={`flex-1 py-3 rounded-full font-semibold transition-all ${
                    collection === "local" ? "text-black" : "text-white border"
                  }`}
                  style={{
                    backgroundColor:
                      collection === "local" ? themeColor : "transparent",
                    borderColor: themeColor,
                  }}
                >
                  Local
                </button>
                <button
                  type="button"
                  onClick={() => setCollection("foreign")}
                  className={`flex-1 py-3 rounded-full font-semibold transition-all ${
                    collection === "foreign"
                      ? "text-black"
                      : "text-white border"
                  }`}
                  style={{
                    backgroundColor:
                      collection === "foreign" ? themeColor : "transparent",
                    borderColor: themeColor,
                  }}
                >
                  Foreign
                </button>
              </div>
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="text-white text-sm block mb-3">
                Main Profile Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleMainImageChange}
                className="text-white w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-black hover:file:opacity-80 transition-all"
                style={{
                  accentColor: themeColor,
                }}
                accept="image/*"
              />
            </div>

            {/* Gallery Images Upload */}
            <div>
              <label className="text-white text-sm block mb-3">
                Gallery Images (Optional)
              </label>
              <input
                type="file"
                multiple
                onChange={handleGalleryChange}
                className="text-white w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-black hover:file:opacity-80 transition-all"
                style={{
                  accentColor: themeColor,
                }}
                accept="image/*"
              />
            </div>

            {/* Form Fields */}
            <div>
              <input
                type="text"
                placeholder="Full Name *"
                required
                className="w-full bg-transparent border-b-2 p-3 text-white outline-none focus:border-opacity-100 transition-all"
                style={{ borderColor: themeColor }}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData.name}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Age"
                className="w-full bg-transparent border-b-2 p-3 text-white outline-none focus:border-opacity-100 transition-all"
                style={{ borderColor: themeColor }}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                value={formData.age}
              />
              <input
                type="text"
                placeholder="Weight"
                className="w-full bg-transparent border-b-2 p-3 text-white outline-none focus:border-opacity-100 transition-all"
                style={{ borderColor: themeColor }}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                value={formData.weight}
              />
              <input
                type="text"
                placeholder="Height"
                className="w-full bg-transparent border-b-2 p-3 text-white outline-none focus:border-opacity-100 transition-all"
                style={{ borderColor: themeColor }}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                value={formData.height}
              />
            </div>

            <div>
              <textarea
                placeholder="Bio / Description"
                rows="4"
                className="w-full bg-transparent border-2 rounded-xl p-3 text-white outline-none focus:border-opacity-100 transition-all resize-none"
                style={{ borderColor: themeColor }}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                value={formData.description}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !mainImage}
              className="w-full py-4 rounded-full text-black font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ backgroundColor: themeColor }}
            >
              {loading
                ? `Uploading ${(galleryFiles.length || 0) + 1} images...`
                : "Save to Database"}
            </button>
          </form>
        </div>

        {/* Right Column - Image Previews */}
        <div>
          <div className="sticky top-6 space-y-6">
            {/* Main Image Preview */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Main Profile Image Preview
              </h3>
              {mainImagePreview ? (
                <div
                  className="relative border-2 rounded-2xl overflow-hidden"
                  style={{ borderColor: themeColor }}
                >
                  <img
                    src={mainImagePreview}
                    alt="Main preview"
                    className="w-full h-96 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full font-bold hover:bg-red-600 transition-all"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-2xl h-96 flex items-center justify-center"
                  style={{ borderColor: themeColor }}
                >
                  <div className="text-center">
                    <span className="text-6xl opacity-30">🖼️</span>
                    <p className="text-gray-400 mt-4">No image selected</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images Preview */}
            {galleryPreviews.length > 0 && (
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Gallery Images ({galleryPreviews.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative border rounded-xl overflow-hidden"
                      style={{ borderColor: themeColor }}
                    >
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition-all text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GlobalModal */}
      {Modal}
    </div>
  );
};

export default AdminUpload;
