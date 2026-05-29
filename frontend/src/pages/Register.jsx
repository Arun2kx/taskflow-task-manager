import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await registerUser(form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex">
      {/* Left side */}
<div
  className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10"
  style={{ background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif" }}
>
  {/* Logo */}
  <div className="flex items-start gap-2.5">
    <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#b5560a" }} />
    <span className="text-[15px] font-medium" style={{ color: "#1c1a17", letterSpacing: "-0.3px" }}>
      TaskFlow
    </span>
  </div>

  {/* Main */}
  <div>
    <div className="w-7 h-[3px] rounded-full mb-5" style={{ background: "#b5560a" }} />
    <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: "#9c8b74" }}>
      task management, simplified
    </p>

    <h2
      className="text-[36px] leading-tight mb-1"
      style={{ fontFamily: "'Lora', serif", fontWeight: 400, color: "#1c1a17" }}
    >
      Stay Organized.
    </h2>
    <h2
      className="text-[36px] leading-tight mb-6"
      style={{ fontFamily: "'Lora', serif", fontWeight: 500, fontStyle: "italic", color: "#1c1a17" }}
    >
      Stay Productive.
    </h2>

    <p className="text-sm leading-relaxed" style={{ color: "#7a6e60", maxWidth: "280px" }}>
      Create tasks, track progress, manage priorities — and actually get things done.
    </p>

    <div className="mt-7" style={{ borderTop: "1px solid #e0d7c8" }}>
      {[
        "Create and manage tasks across stages",
        "Move cards from To Do to Done",
        "Set priorities — high, medium, low",
        "Your tasks, only yours",
      ].map((text, i, arr) => (
        <div
          key={text}
          className="flex items-start gap-2.5 py-2.5"
          style={{ borderBottom: i < arr.length - 1 ? "1px solid #e0d7c8" : "none" }}
        >
          <div className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0" style={{ background: "#b5560a" }} />
          <span className="text-[13px]" style={{ color: "#5a5044", lineHeight: "1.5" }}>
            {text}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Footer */}
  <div className="flex items-center justify-between">
    <span className="text-xs" style={{ color: "#b0a090" }}>
      built by <span style={{ color: "#7a6e60", fontWeight: 500 }}>@Arun</span>
    </span>
    <span className="text-xs" style={{ color: "#b0a090" }}>2025</span>
  </div>
</div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900">Create account</h1>
            <p className="text-neutral-500 text-sm mt-1">Free to use, always.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300"
              />
            </div>

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
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-500">Already have an account? </span>
            <Link to="/login" className="text-neutral-800 font-medium hover:underline">
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
