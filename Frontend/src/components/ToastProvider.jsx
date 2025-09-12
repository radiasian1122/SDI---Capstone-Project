import React, { createContext, useState, useCallback } from "react";

export const ToastCtx = createContext(null); // export context ONLY

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type, persistent }

  const showToast = useCallback((message, type = "info", ms = 2500) => {
    const persistent = ms === 0 || ms == null;
    setToast({ message, type, persistent });
    window.clearTimeout(showToast._t);
    if (!persistent) {
      showToast._t = window.setTimeout(() => setToast(null), ms);
    }
  }, []);

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-wrap">
          <div className="toast">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div>{toast.message}</div>
              {toast.persistent && (
                <button
                  aria-label="Close toast"
                  className="btn btn-ghost"
                  onClick={() => setToast(null)}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}

// import React, { createContext, useContext, useState, useCallback } from "react";

// const ToastCtx = createContext(null);
// export function ToastProvider({ children }) {
//   const [toast, setToast] = useState(null); // { message, type }
//   const showToast = useCallback((message, type = "info", ms = 2500) => {
//     setToast({ message, type });
//     window.clearTimeout(showToast._t);
//     showToast._t = window.setTimeout(() => setToast(null), ms);
//   }, []);
//   return (
//     <ToastCtx.Provider value={{ showToast }}>
//       {children}
//       {toast && (
//         <div className="toast-wrap">
//           <div className="toast">{toast.message}</div>
//         </div>
//       )}
//     </ToastCtx.Provider>
//   );
// }
// export const useToast = () => useContext(ToastCtx);
