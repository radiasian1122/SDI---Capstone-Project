// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as apiLogin } from "../API/client";

// ---- DEV user (has all roles) ----
const DEV_ROLES = ["DRIVER", "APPROVER", "DISPATCHER"];
const readDevRole = () => localStorage.getItem("dev-role") || "DISPATCHER";
const makeDevUser = () => ({
  id: 0,
  name: "Dev User",
  email: "dev@convoy.local",
  role: readDevRole(), // current active role (for UI)
  roles: DEV_ROLES, // full permissions (for gates)
});

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (import.meta.env.DEV) {
          // Seed dev user and stop here (no network calls)
          setUser(makeDevUser());
          return;
        }
        // ---- PROD: call your backend ----
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Login
  const login = async (email, password) => {
    if (import.meta.env.DEV) {
      const next = makeDevUser();
      setUser(next);
      return next;
    }
    await apiLogin({ email, password });
    const me = await getMe();
    setUser(me);
    return me;
  };

  // Logout
  const logout = () => {
    setUser(null);
    window.location.href = "/login";
  };

  // DEV ONLY: allow toggling the *active* role for testing
  const setDevRole = (nextRole) => {
    if (!import.meta.env.DEV) return;
    if (!DEV_ROLES.includes(nextRole)) return;
    localStorage.setItem("dev-role", nextRole);
    setUser((u) => (u ? { ...u, role: nextRole } : makeDevUser()));
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, setDevRole }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
