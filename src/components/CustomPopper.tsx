import React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";

interface PopperProps {
  id?: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  children?: React.ReactNode;
}
export default function CustomPopper({
  id,
  open,
  anchorEl,
  children,
}: PopperProps) {
  return (
    <Popper id={id} open={open} anchorEl={anchorEl}>
      <Box
        sx={{
          border: 1,
          borderColor: "#ddd",
          p: 1,
          bgcolor: "background.paper",
          borderRadius: "8px",
        }}
      >
        {children}
      </Box>
    </Popper>
  );
}
