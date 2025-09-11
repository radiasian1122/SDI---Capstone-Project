import { createContext, useState } from "react";

export const VehiclesContext = createContext();

export function VehiclesContextProvider({ children }) {
  const [dispatchId, setDispatchId] = useState([]);

  return (
    <VehiclesContext value={{ dispatchId, setDispatchId }}>
      {children}
    </VehiclesContext>
  );
}
