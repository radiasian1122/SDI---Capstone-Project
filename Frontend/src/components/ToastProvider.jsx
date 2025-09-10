import React, { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = useCallback((message, type = "info", ms = 2500) => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), ms);
  }, []);
  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-wrap">
          <div className="toast">{toast.message}</div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
