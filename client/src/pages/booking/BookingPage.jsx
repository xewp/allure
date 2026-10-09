import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import API_URL from "../../config/api";

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("LOCAL");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    event: "",
    eventDate: "",
    eventTime: "",
    selectedModel: "",
  });

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  useEffect(() => {
    if (!showConfirmation && !showBookingDetails) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setShowConfirmation(false);
      setShowBookingDetails(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmation, showBookingDetails]);

  // Fetch user's favorites and auto-fill name on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        const userData = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
        const userId = userData.id || userData._id;

        if (!token || !userId) {
          setError("Please log in to make a booking");
          return;
        }

        // Auto-fill user's full name
        const fullName = `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim();
        if (fullName) {
          setFormData((prev) => ({
            ...prev,
            name: fullName,
          }));
        }

        // Get favorites from localStorage user data
        if (userData.favorites && userData.favorites.length > 0) {
          setFavorites(userData.favorites);
        } else {
          // Fetch fresh user data to get favorites
          const userId = userData.id || userData._id;
          const response = await fetch(`${API_URL}/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user.favorites) {
              setFavorites(data.user.favorites);
            }
          }
        }
      } catch {
        // The form remains available; errors are surfaced when the user submits.
      }
    };

    fetchFavorites();
    fetchBookings();
  }, []);

  // Fetch user's bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings || []);
        }
      }
    } catch {
      // Silent error handling for production
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch model image if not available in booking
  const getModelImage = async (modelId, modelCategory) => {
    try {
      const endpoint =
        modelCategory?.toLowerCase() === "foreign" ? "foreign" : "local";
      const response = await fetch(`${API_URL}/models/${endpoint}`);

      if (response.ok) {
        const data = await response.json();
        const models = Array.isArray(data) ? data : data.models || [];
        const model = models.find((m) => m._id === modelId);
        return model?.imageUrl || "";
      }
    } catch {
      // Silent error handling
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation - company is now optional
    if (
      !formData.event ||
      !formData.eventDate ||
      !formData.eventTime ||
      !formData.selectedModel
    ) {
      setError("Please provide all required fields");
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");

      if (!token) {
        setError("Please log in to make a booking");
        setLoading(false);
        return;
      }

      // Find selected model details
      const selectedModelData = favorites.find(
        (fav) => fav.modelId === formData.selectedModel,
      );

      if (!selectedModelData) {
        setError("Please select a model from your favorites");
        setLoading(false);
        return;
      }

      const bookingData = {
        userName: formData.name,
        company: formData.company,
        event: formData.event,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        modelId: selectedModelData.modelId,
        modelName: selectedModelData.name,
        modelCategory: selectedModelData.category?.toLowerCase() || "local",
        modelImageUrl: selectedModelData.imageUrl || "",
      };

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          name: "",
          company: "",
          event: "",
          eventDate: "",
          eventTime: "",
          selectedModel: "",
        });

        // Refresh bookings list
        fetchBookings();

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.message || "Failed to create booking");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  // Get selected model details for confirmation
  const selectedModelData = favorites.find(
    (fav) =>
      fav.modelId === formData.selectedModel ||
      fav._id === formData.selectedModel,
  );

  const fieldClassName =
    "w-full rounded-xl border border-porcelain/15 bg-obsidian px-4 py-3.5 text-base text-porcelain outline-none transition placeholder:text-taupe/60 focus:border-brass focus:ring-2 focus:ring-brass/20";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "border-success/40 bg-success/15 text-emerald-200";
      case "completed":
        return "border-sky-400/40 bg-sky-400/10 text-sky-200";
      case "cancelled":
        return "border-danger/40 bg-danger/15 text-red-200";
      default:
        return "border-brass/40 bg-brass/10 text-brass-light";
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-obsidian pb-24 text-porcelain md:pb-0">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        <section className="border-b border-porcelain/10">
          <div className="mx-auto grid max-w-7xl gap-10 px-3 py-12 sm:px-6 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
            <div className="self-start lg:sticky lg:top-28">
              <p className="editorial-kicker">Private bookings</p>
              <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
                Let&apos;s shape an
                <span className="block italic text-brass">unforgettable moment.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-taupe sm:text-lg">
                Tell us about your event and select a favorite talent. The
                VELORA team will review the details and coordinate the next
                steps with you.
              </p>

              <div className="mt-10 grid grid-cols-3 border-y border-porcelain/15 py-5 text-center lg:text-left">
                <div>
                  <span className="block font-serif text-2xl text-porcelain">01</span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.18em] text-taupe">Select</span>
                </div>
                <div className="border-x border-porcelain/15 px-2 lg:px-5">
                  <span className="block font-serif text-2xl text-porcelain">02</span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.18em] text-taupe">Request</span>
                </div>
                <div className="pl-2 lg:pl-5">
                  <span className="block font-serif text-2xl text-porcelain">03</span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.18em] text-taupe">Confirm</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-porcelain/15 bg-ink p-5 shadow-editorial sm:p-8 lg:p-10">
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-porcelain/10 pb-5">
                <div>
                  <p className="editorial-kicker">Booking request</p>
                  <h2 className="mt-2 font-serif text-3xl">Event details</h2>
                </div>
                <span className="text-xs text-taupe">* Required</span>
              </div>

              {success && (
                <div
                  role="status"
                  className="mb-5 rounded-xl border border-success/40 bg-success/15 p-4 text-sm text-emerald-100"
                >
                  Booking request submitted successfully.
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-danger/50 bg-danger/15 p-4 text-sm text-red-100"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-porcelain">
                      Company <span className="font-normal text-taupe">(optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company or brand name"
                      className={fieldClassName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="event" className="mb-2 block text-sm font-medium text-porcelain">
                      Event *
                    </label>
                    <input
                      id="event"
                      type="text"
                      name="event"
                      value={formData.event}
                      onChange={handleInputChange}
                      placeholder="Event name or type"
                      className={fieldClassName}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="eventDate" className="mb-2 block text-sm font-medium text-porcelain">
                      Event date *
                    </label>
                    <input
                      id="eventDate"
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={fieldClassName}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="eventTime" className="mb-2 block text-sm font-medium text-porcelain">
                      Event time *
                    </label>
                    <input
                      id="eventTime"
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      className={fieldClassName}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="selectedModel" className="mb-2 block text-sm font-medium text-porcelain">
                      Talent from your favorites *
                    </label>
                    <select
                      id="selectedModel"
                      name="selectedModel"
                      value={formData.selectedModel}
                      onChange={handleInputChange}
                      className={fieldClassName}
                      required
                    >
                      <option value="">Choose a talent</option>
                      {favorites.length === 0 ? (
                        <option value="" disabled>
                          No favorites yet. Add talent to favorites first.
                        </option>
                      ) : (
                        favorites.map((fav) => (
                          <option key={fav.modelId} value={fav.modelId}>
                            {fav.name} ({fav.category || "Local"})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {selectedModelData && (
                  <div className="flex items-center gap-4 rounded-xl border border-brass/30 bg-brass/5 p-3">
                    {selectedModelData.imageUrl && (
                      <img
                        src={selectedModelData.imageUrl}
                        alt=""
                        className="h-16 w-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-brass">Selected talent</p>
                      <p className="mt-1 font-serif text-xl">{selectedModelData.name}</p>
                    </div>
                  </div>
                )}

                {favorites.length === 0 && (
                  <div className="rounded-xl border border-porcelain/10 bg-obsidian/50 p-4 text-sm leading-6 text-taupe">
                    Add at least one talent to your favorites before making a
                    booking.
                    <button
                      type="button"
                      onClick={() => navigate("/main")}
                      className="ml-1 font-semibold text-brass underline decoration-brass/40 underline-offset-4"
                    >
                      Browse talent
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || favorites.length === 0}
                  className="w-full rounded-xl bg-oxblood px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-porcelain transition hover:bg-oxblood-light disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? "Submitting…" : "Review request"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-3 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 border-b border-porcelain/15 pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="editorial-kicker">Your activity</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">My bookings</h2>
            </div>
            {!bookingsLoading && bookings.length > 0 && (
              <p className="text-sm text-taupe">
                {bookings.length} {bookings.length === 1 ? "request" : "requests"}
              </p>
            )}
          </div>

          {bookingsLoading ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-porcelain/10 bg-ink">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-porcelain/15 border-t-brass" />
              <p className="mt-4 text-sm text-taupe">Loading your bookings…</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-porcelain/20 bg-ink px-6 py-14 text-center">
              <p className="font-serif text-2xl">No bookings yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-taupe">
                Once you submit a request, its progress and details will appear
                here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <button
                  type="button"
                  key={booking._id}
                  onClick={async () => {
                    let bookingWithImage = { ...booking };
                    if (!booking.modelImageUrl) {
                      const imageUrl = await getModelImage(
                        booking.modelId,
                        booking.modelCategory,
                      );
                      bookingWithImage.modelImageUrl = imageUrl;
                    }
                    setSelectedBooking(bookingWithImage);
                    setShowBookingDetails(true);
                  }}
                  className="group rounded-2xl border border-porcelain/15 bg-ink p-5 text-left transition hover:-translate-y-1 hover:border-brass/50"
                >
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${getStatusColor(booking.status)}`}>
                      {booking.status || "pending"}
                    </span>
                    <span className="text-sm text-taupe transition group-hover:translate-x-1 group-hover:text-brass" aria-hidden="true">→</span>
                  </div>
                  <p className="editorial-kicker">{booking.modelName}</p>
                  <h3 className="mt-2 font-serif text-2xl text-porcelain">{booking.event}</h3>
                  <dl className="mt-6 space-y-2 border-t border-porcelain/10 pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-taupe">Date</dt>
                      <dd>{new Date(booking.eventDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-taupe">Time</dt>
                      <dd>{booking.eventTime}</dd>
                    </div>
                    {booking.company && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-taupe">Company</dt>
                        <dd className="truncate">{booking.company}</dd>
                      </div>
                    )}
                  </dl>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {showConfirmation && selectedModelData && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-obsidian/90 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowConfirmation(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-booking-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-porcelain/15 bg-ink shadow-editorial sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-porcelain/10 p-5 sm:p-7">
              <p className="editorial-kicker">Final check</p>
              <h2 id="confirm-booking-title" className="mt-2 font-serif text-3xl">Confirm your request</h2>
              <p className="mt-2 text-sm text-taupe">Review the details before sending them to our team.</p>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="flex items-center gap-4 rounded-xl border border-porcelain/10 bg-obsidian p-4">
                {selectedModelData.imageUrl && (
                  <img src={selectedModelData.imageUrl} alt={selectedModelData.name} className="h-24 w-20 rounded-lg object-cover" />
                )}
                <div>
                  <p className="editorial-kicker">Selected talent</p>
                  <p className="mt-1 font-serif text-2xl">{selectedModelData.name}</p>
                  <p className="mt-1 text-sm capitalize text-taupe">{selectedModelData.category || "Local"} talent</p>
                </div>
              </div>

              <dl className="divide-y divide-porcelain/10 rounded-xl border border-porcelain/10 px-4">
                {[
                  ["Company", formData.company || "Not specified"],
                  ["Event", formData.event],
                  ["Date", new Date(formData.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                  ["Time", formData.eventTime],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-6 py-3.5 text-sm">
                    <dt className="text-taupe">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="rounded-xl border border-brass/25 bg-brass/5 p-4 text-sm leading-6 text-brass-light">
                Your request will be submitted for admin approval. The VELORA
                team will contact you after review.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setShowConfirmation(false)} className="rounded-xl border border-porcelain/20 px-5 py-3.5 text-sm font-semibold transition hover:bg-porcelain/5">
                  Go back and edit
                </button>
                <button type="button" onClick={handleConfirmBooking} disabled={loading} className="rounded-xl bg-oxblood px-5 py-3.5 text-sm font-semibold text-porcelain transition hover:bg-oxblood-light disabled:opacity-50">
                  {loading ? "Submitting…" : "Confirm booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingDetails && selectedBooking && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-obsidian/90 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowBookingDetails(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-details-title"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-porcelain/15 bg-ink shadow-editorial sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-porcelain/10 p-5 sm:p-7">
              <div>
                <p className="editorial-kicker">Booking {selectedBooking._id?.slice(-8).toUpperCase()}</p>
                <h2 id="booking-details-title" className="mt-2 font-serif text-3xl">Booking details</h2>
              </div>
              <button type="button" onClick={() => setShowBookingDetails(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-porcelain/15 text-xl text-taupe transition hover:border-brass hover:text-brass" aria-label="Close booking details">×</button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <span className={`inline-flex rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${getStatusColor(selectedBooking.status)}`}>
                {selectedBooking.status || "pending"}
              </span>

              <div className="flex items-center gap-4 rounded-xl border border-porcelain/10 bg-obsidian p-4">
                {selectedBooking.modelImageUrl && (
                  <img src={selectedBooking.modelImageUrl} alt={selectedBooking.modelName} className="h-24 w-20 rounded-lg object-cover" />
                )}
                <div>
                  <p className="editorial-kicker">Talent</p>
                  <p className="mt-1 font-serif text-2xl">{selectedBooking.modelName}</p>
                  <p className="mt-1 text-sm capitalize text-taupe">{selectedBooking.modelCategory || "Local"}</p>
                </div>
              </div>

              <dl className="divide-y divide-porcelain/10 rounded-xl border border-porcelain/10 px-4">
                {[
                  ...(selectedBooking.company ? [["Company", selectedBooking.company]] : []),
                  ["Event", selectedBooking.event],
                  ["Date", new Date(selectedBooking.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                  ["Time", selectedBooking.eventTime],
                  ["Booked on", new Date(selectedBooking.createdAt).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-6 py-3.5 text-sm">
                    <dt className="text-taupe">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>

              <button type="button" onClick={() => setShowBookingDetails(false)} className="w-full rounded-xl bg-porcelain px-5 py-3.5 text-sm font-semibold text-obsidian transition hover:bg-brass-light">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
