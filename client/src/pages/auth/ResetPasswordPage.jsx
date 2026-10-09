import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_URL from "../../config/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !userId) {
        setError("Invalid reset link. Please request a new one.");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/users/reset-password/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, userId }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          setValidToken(true);
        } else {
          setError(data.message || "Invalid or expired reset token");
        }
      } catch {
        setError("Unable to verify reset link. Please try again.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, userId]);

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/users/reset-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, userId, newPassword }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (verifying) {
      return (
        <div className="flex flex-col items-center gap-5 py-10" role="status">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-obsidian/15 border-t-oxblood" />
          <p className="text-sm font-medium text-warm-gray">Verifying your secure link...</p>
        </div>
      );
    }

    if (!validToken) {
      return (
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10 font-serif text-2xl text-danger" aria-hidden="true">!</div>
          <h2 className="font-serif text-3xl">Link unavailable</h2>
          <p className="max-w-sm text-sm leading-6 text-danger" role="alert">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 rounded-lg bg-obsidian px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          >
            Back to login
          </button>
        </div>
      );
    }

    if (success) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center" role="status">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-2xl text-white" aria-hidden="true">✓</div>
          <h2 className="font-serif text-3xl">Password updated</h2>
          <p className="text-sm text-warm-gray">Your password has been reset successfully.</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-taupe">Redirecting to login...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="new-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
          />
        </div>
        
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger" role="alert">
            {error}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-oxblood py-3.5 text-sm font-semibold text-white transition hover:bg-oxblood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-4 py-10 font-sans text-obsidian sm:px-6">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-0 h-px w-full bg-brass/30" />
        <div className="absolute -right-32 top-16 h-72 w-72 rounded-full border border-brass/15" />
      </div>

      <section className="relative z-10 flex w-full max-w-lg flex-col border border-porcelain/10 bg-porcelain p-6 shadow-editorial sm:p-10 md:p-12" aria-labelledby="reset-password-title">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 block w-fit text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          aria-label="VELORA home"
        >
          <span className="block font-serif text-2xl tracking-[0.14em]">VELORA</span>
          <span className="block text-[8px] font-semibold tracking-[0.3em] text-oxblood">TALENT &amp; EVENTS</span>
        </button>

        <div className="mb-8">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-oxblood">Account security</p>
          <h1 id="reset-password-title" className="font-serif text-4xl leading-tight sm:text-5xl">Reset your password</h1>
          <p className="mt-3 text-sm leading-6 text-warm-gray">Choose a new password for your VELORA account.</p>
        </div>

        {renderContent()}
      </section>
    </main>
  );
};

export default ResetPasswordPage;
