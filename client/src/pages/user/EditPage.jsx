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
    <div className="min-h-screen bg-porcelain font-sans text-obsidian">
      <Header activeTab="PROFILE" />

      <main className="min-h-[calc(100vh-160px)] px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="mx-auto grid w-full max-w-5xl border border-obsidian/10 bg-white lg:grid-cols-[0.8fr_1.2fr]">
          <section className="relative overflow-hidden bg-ink p-7 text-porcelain sm:p-10 lg:p-12" aria-labelledby="edit-page-title">
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full border border-brass/20" aria-hidden="true" />
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-brass">VELORA account</p>
            <h1 id="edit-page-title" className="font-serif text-4xl leading-tight sm:text-5xl">
              Update your profile
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-taupe">
              Keep your account details up to date. Changes saved here will be
              reflected across your profile.
            </p>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="relative mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-brass underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              Back to profile
            </button>
          </section>

          <section className="p-6 sm:p-10 lg:p-12" aria-label="Profile details form">
              {success && (
                <div className="mb-6 rounded-lg border border-success/30 bg-success/10 p-4 text-sm font-medium text-success" role="status">
                  ✓ Profile updated successfully!
                </div>
              )}
              {error && (
                <div className="mb-6 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm font-medium text-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="edit-full-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
                    Full Name
                  </label>
                  <input
                    id="edit-full-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
                  />
                </div>

                <div>
                  <label htmlFor="edit-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
                    Email Address
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
                  />
                </div>

                <div>
                  <label htmlFor="edit-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
                    New Password
                  </label>
                  <input
                    id="edit-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    placeholder="Enter a new password (optional)"
                    className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-oxblood px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-oxblood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPage;
