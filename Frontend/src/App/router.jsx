import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
// Homepage and generic list pages removed (unused)
import NewRequest from "../pages/driver/NewRequest";
import Approvals from "../pages/approver/Approvals";
import DispatchForm from "../pages/DispatchForm";
import Dispatches from "../pages/dispatcher/Dispatches";
import Vehicles from "../pages/dispatcher/Vehicles";
import ProtectedRoute from "../components/ProtectedRoute";
import NavBar from "../components/Navbar";

const ThemePreview = lazy(() => import("../pages/ThemePreview"));
export default function AppRouter() {
  return (
    <Routes>
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

      {/* Driver */}
      <Route
        path="/driver/new-request"
        element={
          <ProtectedRoute roles={["DRIVER"]}>
            <NavBar />
            <NewRequest />
          </ProtectedRoute>
        }
      />

      {/* Approver */}
      <Route
        path="/approver/approvals"
        element={
          <ProtectedRoute roles={["APPROVER"]}>
            <NavBar />
            <Approvals />
          </ProtectedRoute>
        }
      />

      {/* Dispatcher */}
      <Route
        path="/dispatcher/dispatches"
        element={
          <ProtectedRoute roles={["DISPATCHER"]}>
            <NavBar />
            <Dispatches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dispatcher/vehicles"
        element={
          <ProtectedRoute roles={["DISPATCHER"]}>
            <NavBar />
            <Vehicles />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />} />
      {/* Removed unused routes: /home, /vehicles, /operators */}
    </Routes>
  );
}
