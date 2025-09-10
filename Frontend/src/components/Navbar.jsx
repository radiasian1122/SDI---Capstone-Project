import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// this is to all access without authentication use useAuth wrapper later.
let useAuthSafe = () => ({ user: null, loading: false, logout: () => {} });
try {
  const { useAuth } = require("../context/AuthContext");
  useAuthSafe = useAuth;
} catch {}

export default function NavBar() {
  const { user, loading, logout } = useAuthSafe() || {};
  const navigate = useNavigate();

  const linkBase = "px-2 py-1 rounded transition-colors";
  const linkActive = "font-semibold";
  const linkHoverStyle = { background: "var(--color-surface-muted)" };

  return (
    <nav className="cc-nav">
      <div className="cc-nav-inner">
        <div
          className="cc-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Convoy Connect
        </div>

        {/* Main nav links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            style={linkHoverStyle}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/driver/new-request"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            style={linkHoverStyle}
          >
            New Request
          </NavLink>
          <NavLink
            to="/approver/approvals"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            style={linkHoverStyle}
          >
            Approvals
          </NavLink>
          <NavLink
            to="/dispatcher/dispatches"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            style={linkHoverStyle}
          >
            Dispatches
          </NavLink>
          <NavLink
            to="/dispatcher/vehicles"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            style={linkHoverStyle}
          >
            Vehicles
          </NavLink>
        </div>

        <div className="cc-spacer" />

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!loading && user ? (
            <>
              <span className="text-sm" style={{ color: "var(--color-text)" }}>
                {user.name || user.email || "Signed in"}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  try {
                    logout?.();
                  } catch {
                    navigate("/login");
                  }
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// function Navbar (){
//   return (
//     <>
//     <h1>Convoy Connect</h1>
//     <div>Dispatch Overview</div>
//     <div>Driver Overview</div>
//     <div>Dispatch Form</div>
//     <div>Profile</div>
//     <button>LOG OUT</button>
//     </>
//   )
// }

// export default Navbar
