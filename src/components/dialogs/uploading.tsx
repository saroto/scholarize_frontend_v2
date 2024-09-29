/** @format */

"use client";
import { Dialog, Box, CircularProgress, Typography } from "@mui/material";

export default function UploadingDialog({
  isUploading,
}: Readonly<{ isUploading: boolean }>) {
  return (
    <Dialog
      open={isUploading}
      disableEscapeKeyDown
      fullScreen
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .MuiDialog-paper": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            mr: 5,
            fontFamily: "monospace !important",
          }}
        >
          Uploading Files
        </Typography>
        <CircularProgress
          size="3rem"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </Box>
    </Dialog>
  );
}
