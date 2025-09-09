import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Homepage from "../pages/Homepage";
import DispatchForm from "../pages/DispatchForm";
import ProtectedRoute from "../components/ProtectedRoute";
import NavBar from "../components/Navbar";
import ViewVehicles from "../pages/ViewVehicles";
import ViewDrivers from "../pages/ViewDrivers";

const ThemePreview = lazy(() => import("../pages/ThemePreview"));
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/vehicles" element={<ViewVehicles />} />
      <Route path="/operators" element={<ViewDrivers />} />

      {/* Dev-only Navigation for testing, use Localhost:5173/ `path=""` to navigate
      Theme Preview */}
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
      {import.meta.env.DEV && (
        <>
          <Route path="/dev/Dashboard" element={<Dashboard />} />
          <Route path="/dev/Homepage" element={<Homepage />} />
          <Route path="/dev/DispatchForm" element={<DispatchForm />} />
        </>
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
