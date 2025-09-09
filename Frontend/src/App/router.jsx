import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import ProtectedRoute from "../Components/ProtectedRoute";
import NavBar from "../Components/Navbar";
const ThemePreview = lazy(() => import("../Pages/ThemePreview"));

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Homepage />} />

      {/* Dev-only Theme Preview */}
      {import.meta.env.DEV && (
        <Route
          path="/theme-preview"
          element={
            <Suspense fallback={<div className="cc-page">Loading…</div>}>
              <ThemePreview />
            </Suspense>
          }
        />
      )}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <NavBar />
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/theme-preview" element={<ThemePreview />} />
    </Routes>
  );
}
