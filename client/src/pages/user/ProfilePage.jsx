import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import EditProfileModal from "../../components/profile/EditProfileModal";
import OTPModal from "../../components/auth/OTPModal";
import API_URL from "../../config/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  // Fetch user data from MongoDB
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        const storedUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");

        // Support both old (_id) and new (id) user object formats
        const userId = storedUser.id || storedUser._id;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {

        setError(err.message || "Failed to load profile data");
        setLoading(false);
      }
    };

    fetchUserData();
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleVerifyEmail = () => {
    setShowOTPModal(true);
  };

  const handleOTPSuccess = async () => {
    setShowOTPModal(false);
    // Refresh user data to show updated verification status
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const userId = user._id;
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data.user);
      // Update sessionStorage & localStorage
      const storedUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
      storedUser.emailVerified = true;
      sessionStorage.setItem("user", JSON.stringify(storedUser));
    } catch {
      // Keep the existing profile visible if the verification refresh fails.
    }
  };

  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-porcelain text-obsidian">
        <div className="text-center" role="status">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-obsidian/15 border-t-oxblood" />
          <p className="text-sm font-medium text-warm-gray">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain text-obsidian">
        <Header activeTab="PROFILE" />
        <main className="flex flex-grow items-center justify-center px-5 py-16">
          <div className="max-w-md text-center" role="alert">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10 font-serif text-2xl text-danger">!</div>
            <h2 className="mb-2 font-serif text-3xl">
              Error Loading Profile
            </h2>
            <p className="mb-7 text-sm leading-6 text-warm-gray">{error}</p>
            <button
              onClick={() => navigate("/main")}
              className="rounded-lg bg-oxblood px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-oxblood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
            >
              Browse talent
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden bg-porcelain font-sans text-obsidian transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Header activeTab="PROFILE" />

      <main className="relative z-10 flex-grow px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="mx-auto w-full max-w-6xl">
          <section className="relative overflow-hidden bg-ink px-6 py-9 text-porcelain sm:px-9 lg:px-12 lg:py-12">
            <div className="absolute inset-y-0 right-0 w-1/3 border-l border-porcelain/10" aria-hidden="true" />
            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-5 sm:gap-7">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-brass/50 bg-brass/10 font-serif text-3xl text-brass sm:h-24 sm:w-24 sm:text-4xl" aria-hidden="true">
                  {initials || "V"}
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-brass">VELORA account</p>
                  <h1 className="font-serif text-3xl leading-tight sm:text-5xl">{user?.firstName} {user?.lastName}</h1>
                  <p className="mt-2 text-sm text-taupe">Your details, access, and account security.</p>
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="w-full rounded-lg bg-porcelain px-5 py-3 text-sm font-semibold text-obsidian transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:w-auto"
              >
                Edit profile
              </button>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]">
            <section className="border border-obsidian/10 bg-white p-5 sm:p-8" aria-labelledby="personal-details-title">
              <div className="mb-7 flex items-center justify-between gap-4 border-b border-obsidian/10 pb-5">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-oxblood">Account</p>
                  <h2 id="personal-details-title" className="font-serif text-2xl sm:text-3xl">Personal details</h2>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${user?.emailVerified ? "bg-success/10 text-success" : "bg-brass/20 text-brass-dark"}`}>
                  {user?.emailVerified ? "Verified" : "Verification pending"}
                </span>
              </div>

              <dl className="grid gap-x-8 sm:grid-cols-2">
                <div className="border-b border-obsidian/10 py-5 sm:pt-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">Email address</dt>
                  <dd className="mt-2 break-all text-sm font-medium text-obsidian">{user?.email || "Not provided"}</dd>
                </div>
                <div className="border-b border-obsidian/10 py-5 sm:pt-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">Phone number</dt>
                  <dd className="mt-2 text-sm font-medium text-obsidian">{user?.phoneNumber || "Not provided"}</dd>
                </div>
                <div className="border-b border-obsidian/10 py-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">Age</dt>
                  <dd className="mt-2 text-sm font-medium text-obsidian">{user?.age ? `${user.age} years` : "Not provided"}</dd>
                </div>
                <div className="border-b border-obsidian/10 py-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">Member since</dt>
                  <dd className="mt-2 text-sm font-medium text-obsidian">{memberSince}</dd>
                </div>
              </dl>

              {!user?.emailVerified && (
                <div className="mt-7 flex flex-col gap-4 border border-brass/40 bg-brass/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-obsidian">Verify your email address</p>
                    <p className="mt-1 text-xs leading-5 text-warm-gray">Confirm your email to keep your account secure.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="flex-shrink-0 rounded-lg bg-obsidian px-5 py-3 text-xs font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
                  >
                    Verify email
                  </button>
                </div>
              )}
            </section>

            <aside className="border border-obsidian/10 bg-white p-5 sm:p-8" aria-labelledby="account-actions-title">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-oxblood">Shortcuts</p>
              <h2 id="account-actions-title" className="font-serif text-2xl sm:text-3xl">Account actions</h2>
              <div className="mt-7 flex flex-col">
                <button
                  onClick={() => navigate("/main")}
                  className="flex items-center justify-between border-t border-obsidian/10 py-4 text-left text-sm font-semibold transition hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
                >
                  Browse talent <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={handleEditProfile}
                  className="flex items-center justify-between border-t border-obsidian/10 py-4 text-left text-sm font-semibold transition hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
                >
                  Edit details &amp; password <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between border-y border-obsidian/10 py-4 text-left text-sm font-semibold text-danger transition hover:bg-danger/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                >
                  Log out <span aria-hidden="true">→</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userData={user}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={user?.email}
        onSuccess={handleOTPSuccess}
        onVerifyLater={() => setShowOTPModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
