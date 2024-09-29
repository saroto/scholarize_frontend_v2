/** @format */

"use client";

import React, { ReactNode, createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GetSocketHost } from "./socket_connector";

// Create a socket context
export const SocketContext = createContext<Socket | null>(null);

interface SocketIOProviderProps {
  children: ReactNode;
}

export function SocketIOProvider({ children }: Readonly<SocketIOProviderProps>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketHost, setSocketHost] = useState<string>("");

  const handleGetSocketHost = async () => {
    const host = await GetSocketHost();
    if (!host) {
      return;
    }
    setSocketHost(host);
  };

  useEffect(() => {
    handleGetSocketHost();
  }, []);

  useEffect(() => {
    if (!socketHost) {
      return;
    }
    const newSocket = io(socketHost);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [socketHost]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
