"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { createContext, useContext, useState, ReactNode } from "react";

interface SessionContextType {
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const SessionExpireContext = createContext<SessionContextType | undefined>(
  undefined
);

export const SessionExpireProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sessionExpired, setSessionExpired] = useState(false);

  return (
    <SessionExpireContext.Provider
      value={{ sessionExpired, setSessionExpired }}
    >
      {children}
    </SessionExpireContext.Provider>
  );
};

export const useSessionExpireContext = () => {
  const context = useContext(SessionExpireContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionExpireProvider");
  }
  return context;
};

export default function SessionExpirePopup({
  open,
  onOk,
}: {
  open: boolean;
  onOk: () => void;
}) {
  const handleClose = () => {
    onOk?.();
  };

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1rem",
          width: "100%",
        },
      }}
    >
      <DialogTitle sx={{ textTransform: "capitalize" }}>
        Session Expired
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session has expired. Please login again.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "1rem",
          gap: "0.5rem",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "#555555",
            borderRadius: "1rem",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#000",
            },
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
