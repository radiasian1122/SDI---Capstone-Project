import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./app/router";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
