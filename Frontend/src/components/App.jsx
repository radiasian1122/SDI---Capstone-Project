import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "./ToastProvider";
import { VehiclesContextProvider } from "../context/VehiclesContext";

import AppRouter from "../App/router";

export default function App() {
  return (
    <VehiclesContextProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </VehiclesContextProvider>
  );
}
