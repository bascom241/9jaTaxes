import { useContext } from "react";
import { SocketContext } from "../src/context/SocketContext";
import type { SocketContextType } from "../src/context/SocketContext"; // import type

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
