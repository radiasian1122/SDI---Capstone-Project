import React from "react";
import { AuthProvider } from "../context/AuthContext";
import AppRouter from "../App/router";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
