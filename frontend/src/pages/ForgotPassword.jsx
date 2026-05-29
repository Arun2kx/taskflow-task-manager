import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await forgotPassword(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Password updated</h2>
          <p className="text-neutral-500 text-sm mb-6">You can now log in with your new password.</p>
          <Link
            to="/login"
            className="inline-block bg-[#1a1a1a] text-white px-6 py-2.5 text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-800 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to login
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Reset password</h1>
          <p className="text-neutral-500 text-sm mt-1">Enter your email and choose a new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider block mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="min. 6 characters"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-2.5 text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
