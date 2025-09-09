import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import Homepage from "../Pages/Homepage";
import DispatchForm from "../Pages/DispatchForm";
import ProtectedRoute from "../Components/ProtectedRoute";
import NavBar from "../Components/Navbar";
const ThemePreview = lazy(() => import("../Pages/ThemePreview"));
import Homepage from "../Pages/Homepage";
import ViewVehicles from "../Pages/ViewVehicles";
import ViewDrivers from "../Pages/ViewDrivers";

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
