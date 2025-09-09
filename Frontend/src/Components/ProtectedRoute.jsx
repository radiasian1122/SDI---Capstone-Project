import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  let ctx;
  try {
    ctx = useAuth();
  } catch {
    // Context hook threw because provider is missing
    return (
      <div className="cc-page">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Auth not available</h3>
            <p className="card-subtitle">
              Make sure <code>&lt;AuthProvider&gt;</code> wraps your router (see
              App.jsx).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { user, loading } = ctx || {};
  const location = useLocation();

  if (loading) return <div className="cc-page">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";

// export default function ProtectedRoute({ children, roles }) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
//   if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
//   if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

//   return children;
// }
