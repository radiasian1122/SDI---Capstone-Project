import React from "react";
import { AuthProvider } from "../Context/AuthContext";
import AppRouter from "../App/router";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
