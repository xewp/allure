import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const EditPage = () => {
  const [isEditing, setIsEditing] = useState(true);
  const navigate = useNavigate();

  // User data state
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        age: user.age || "",
      });
    }
  }, []);

  // Handle profile update (only name)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage({ type: "success", text: "Profile updated successfully!" });

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (error) {

      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          setPasswordMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setPasswordMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch (error) {

      setPasswordMessage({
        type: "error",
        text: "An error occurred while changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header Brand */}
      <header className="w-full py-8 text-center">
        <h1 className="text-[#C5A27D] text-2xl font-semibold tracking-widest uppercase">
          Power Allure
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row items-start justify-center px-4 md:px-6 lg:px-32 gap-8 md:gap-12 lg:gap-24 py-8">
        {/* Left Side: Navigation & Forms */}
        <div className="flex-1 flex flex-col items-center lg:items-start w-full max-w-md space-y-8">
          {/* Top Toggle Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
            <button
              onClick={() => setIsEditing(true)}
              className={`${
                isEditing
                  ? "bg-[#D9B992] text-black"
                  : "bg-[#3A3A3A] text-[#C5A27D]"
              } px-6 py-2 rounded-full text-sm font-bold transition-all`}
            >
              Edit Profile
            </button>
            <div className="hidden md:block w-6 h-[1px] bg-[#3A3A3A]"></div>
            <button
              onClick={() => navigate("/main")}
              className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#C5A27D] px-8 py-2 rounded-full text-sm font-medium transition-all"
            >
              Home
            </button>
          </div>

          {/* Profile Edit Form Card */}
          <div className="bg-[#D9B992] rounded-[30px] p-6 md:p-10 w-full text-black shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-center">
              Update Profile
            </h2>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  className="w-full bg-[#C5A27D] border-none rounded-2xl p-4 placeholder:text-black/30 focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  className="w-full bg-[#C5A27D] border-none rounded-2xl p-4 placeholder:text-black/30 focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Disabled Fields */}
              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1 text-black/60">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full bg-[#B8956A] border-none rounded-2xl p-4 text-black/50 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1 text-black/60">
                  Phone Number (Cannot be changed)
                </label>
                <input
                  type="text"
                  value={userData.phoneNumber}
                  disabled
                  className="w-full bg-[#B8956A] border-none rounded-2xl p-4 text-black/50 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1 text-black/60">
                  Age (Cannot be changed)
                </label>
                <input
                  type="number"
                  value={userData.age}
                  disabled
                  className="w-full bg-[#B8956A] border-none rounded-2xl p-4 text-black/50 cursor-not-allowed outline-none"
                />
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-lg text-sm text-center ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-8 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Form Card */}
          <div className="bg-[#D9B992] rounded-[30px] p-6 md:p-10 w-full text-black shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-center">
              Change Password
            </h2>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  className="w-full bg-[#C5A27D] border-none rounded-2xl p-4 placeholder:text-black/30 focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="w-full bg-[#C5A27D] border-none rounded-2xl p-4 placeholder:text-black/30 focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-sm ml-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  className="w-full bg-[#C5A27D] border-none rounded-2xl p-4 placeholder:text-black/30 focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  required
                />
              </div>

              {passwordMessage.text && (
                <div
                  className={`p-3 rounded-lg text-sm text-center ${
                    passwordMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-8 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Profile Image */}
        <div className="flex-1 flex justify-center items-center lg:sticky lg:top-8">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[500px] lg:h-[500px] rounded-full border-[4px] border-[#C5A27D] overflow-hidden shadow-2xl">
            <img
              src="/mark-profile.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end pb-8 md:pb-12">
              <p className="text-lg md:text-xl lg:text-3xl font-bold text-white tracking-tighter">
                TDT <span className="text-[#C5A27D]">POWER</span>STEEL
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 tracking-[0.4em] uppercase font-light">
                The No. 1 Steel Supplier
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPage;
