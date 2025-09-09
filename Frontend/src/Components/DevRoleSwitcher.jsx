import React from "react";
import { useAuth } from "../Context/AuthContext";

export default function DevRoleSwitcher() {
  if (!import.meta.env.DEV) return null; // don’t render in production
  const { user, setDevRole } = useAuth();
  const current = user?.role || "DISPATCHER";

  return (
    <div className="cc-actionbar">
      <span className="badge">DEVELOPER TOOL: SELECT YOUR USER ROLE</span>
      <select
        className="input"
        value={current}
        onChange={(e) => setDevRole?.(e.target.value)}
      >
        {["DRIVER", "APPROVER", "DISPATCHER"].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}
