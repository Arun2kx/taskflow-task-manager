import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="text-base font-semibold text-neutral-900 tracking-tight">TaskFlow</span>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <span className="text-sm text-neutral-700 hidden sm:block">{user?.name}</span>
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-neutral-100 shadow-lg py-1 z-20">
                <div className="px-3.5 py-2.5 border-b border-neutral-100">
                  <p className="text-xs font-medium text-neutral-900 truncate">{user?.name}</p>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
