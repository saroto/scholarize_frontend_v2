/** @format */

import Navbar from "@/app/(landing)/navbar";
import { Box } from "@mui/material";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Navbar is fixed, so it stays at the top */}
        <Navbar />

        {/* Scrollable content area for children */}
        <Box
          sx={{
            flex: "1 1 auto",
            overflowY: "auto",
            paddingTop: "64px",
            paddingInline: { xs: "16px", md: "24px" },
            width: "60%",
            maxWidth: "1200px",
            marginInline: "auto",
            paddingBottom: "10px",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
