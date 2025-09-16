import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  console.log(user)

  const linkBase = "px-2 py-1 rounded transition-colors";
  const linkActive = "font-semibold";
  const linkHoverStyle = { background: "var(--color-surface-muted)" };

  return (
    <nav className="cc-nav">
      <div
        className="cc-nav-inner"
        style={{ padding: "0 16px", width: "100%" }}
      >
        <div
          className="cc-brand"
          style={{ cursor: "pointer", padding: "6px  0px" }}
          onClick={() => navigate("/")}
        >
          Convoy
        </div>
        <img
          alt="Logo"
          className="w-16 h-16"
          src="/public/media/logo-NoBackground.png"
        />
        <div
          className="cc-brand"
          style={{ cursor: "pointer", padding: "6px 0px" }}
          onClick={() => navigate("/")}
        >
          {" "}
          Connect
        </div>

        {/* Main nav links */}
        <div className="cc-nav-links hidden md:flex items-center">
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
          
          {user.role === 'DRIVER' &&
            <NavLink
              to="/driver/new-request"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
              style={linkHoverStyle}
            >
              New Request
            </NavLink>
          }

          { user.role === 'DISPATCHER' &&
            <NavLink
              to="/approver/approvals"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
              style={linkHoverStyle}
            >
              Pending Requests
            </NavLink>
          }


          { user.role === 'DISPATCHER' &&
            <NavLink
              to="/dispatcher/vehicles"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
              style={linkHoverStyle}
            >
              Vehicles
            </NavLink>
          }
        </div>

        <div className="cc-spacer" />

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {!loading && user ? (
            <>
              {/* Left-to-right within group: role, welcome, avatar, theme, logout */}
              {user.role && <span className="badge">{user.role}</span>}
              <span className="text-sm" style={{ color: "var(--color-text)" }}>
                {`Welcome, ${(user.first_name || user.name || "User").toString()}`}
              </span>
              <div
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--color-surface-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
                title={user.name || user.email}
              >
                {(user.first_name || user.name || "U").toString().slice(0, 1)}
              </div>
              <ThemeToggle />
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
                style={{ padding: "6px 10px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/login")}
                style={{ padding: "6px 10px" }}
              >
                Login
              </button>
            </>
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
