import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "./ToastProvider";

import AppRouter from "../App/router";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
