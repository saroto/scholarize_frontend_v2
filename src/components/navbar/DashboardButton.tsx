/** @format */

// components/DashboardButton.tsx
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";

const DashboardButton = () => {
  const { data: session } = useSession();

  const handleAuthClick = () => {
    if (session) {
      const signInHandlerUrl = `${window.location.origin}/dashboard/repository/research-library`;
      // const newWindow = window.open(
      //   signInHandlerUrl,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
      // if (newWindow) newWindow.opener = null;
      window.location.href = signInHandlerUrl;
    } else {
      // Directly invoking the Google sign-in flow
      const signInHandlerUrl = `${window.location.origin}/auth/signin`;
      // const newWindow = window.open(
      //   signInHandlerUrl,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
      // if (newWindow) newWindow.opener = null;
      window.location.href = signInHandlerUrl;
    }
    return;
  };

  return (
    <Button
      variant="contained"
      onClick={handleAuthClick}
      sx={{
        // "&:hover": {
        //   cursor: "pointer",
        //   border: "1px solid blue",
        //   color: "blue",
        // },
        px: "1rem",
        borderRadius: "1rem",
        textTransform: "none",
        boxShadow: "none",
      }}
    >
      {session ? "View Dashboard" : "Get Started"}
    </Button>
  );
};

export default DashboardButton;
