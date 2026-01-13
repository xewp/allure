import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const EditPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual update logic
    setLoading(true);
    setError("");
    setSuccess(false);

    // Mock submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      <Header activeTab="PROFILE" />

      <main className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-5xl bg-charcoal rounded-3xl border border-gold/20 shadow-elegant p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Update Profile
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Keep your account details up to date. Changes saved here will be
              reflected across your profile.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gold rounded-3xl p-8 shadow-lg">
              {success && (
                <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center">
                  ✓ Profile updated successfully!
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black/70 mb-2 ml-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-full bg-gold-dark border-none focus:outline-none focus:ring-2 focus:ring-charcoal/50 text-black placeholder-black/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black/70 mb-2 ml-4">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-full bg-gold-dark border-none focus:outline-none focus:ring-2 focus:ring-charcoal/50 text-black placeholder-black/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black/70 mb-2 ml-4">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter a new password (optional)"
                    className="w-full px-4 py-3 rounded-full bg-gold-dark border-none focus:outline-none focus:ring-2 focus:ring-charcoal/50 text-black placeholder-black/60"
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-charcoal text-white px-10 py-3 rounded-full font-semibold hover:bg-warm-gray transition-colors duration-300 shadow-md disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPage;
