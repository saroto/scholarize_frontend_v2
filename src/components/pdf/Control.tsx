import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface ControlProps {
  transformerRef: React.RefObject<ReactZoomPanPinchRef>;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  pageNumber: number | null;
  setPageNumber: (page: number | null) => void;
  pageNumberChat?: number | null;
  setPageNumberChat?: (page: number | null) => void;
  numPages: number | null;
}
export default function Control({
  transformerRef,
  pageRefs,
  pageNumber,
  setPageNumber,
  pageNumberChat = null,
  setPageNumberChat,
  numPages,
}: ControlProps) {
  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (setPageNumberChat) {
      setPageNumberChat(null);
    }

    // Allow empty input (when the user deletes the content)
    if (value === "") {
      setPageNumber(null);
      return;
    }

    // Convert to number and validate the page number
    const page = Number(value);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    }
  };

  useEffect(() => {
    if (pageNumber !== null && pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [pageNumber, pageRefs]);

  useEffect(() => {
    if (pageNumberChat !== null) {
      setPageNumber(pageNumberChat); // Set into local state
      // Scroll to page
      if (pageRefs.current[pageNumberChat - 1]) {
        pageRefs.current[pageNumberChat - 1]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [pageNumberChat]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        borderRadius: "8px",
        border: "1px solid ",
        borderColor: "#ddd",
        backgroundColor: "background.paper",
        padding: "4px 8px",
      }}
    >
      {/* Zoom Out Button */}
      <IconButton
        size="small"
        onClick={() => {
          if (transformerRef.current) {
            transformerRef.current.zoomOut(0.2);
          }
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      {/* Reset Button */}
      <IconButton
        size="small"
        onClick={() => {
          if (transformerRef.current) {
            transformerRef.current.resetTransform();
          }
        }}
      >
        <RestartAltIcon fontSize="small" />
      </IconButton>

      {/* Zoom In Button */}
      <IconButton
        size="small"
        onClick={() => {
          if (transformerRef.current) {
            transformerRef.current.zoomIn(0.2);
          }
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      {/* Page Number Input */}
      <TextField
        type="text"
        value={pageNumber || ""}
        onChange={handlePageChange}
        sx={{
          borderColor: "#ddd",
          width: 50,
          height: 30,
          "& .MuiInputBase-root": {
            height: 30,
            fontSize: "0.83rem",
            padding: "0 8px",
            fontWeight: 500,
          },
          "& .MuiOutlinedInput-input": {
            textAlign: "center",
            padding: "5px",
          },
        }}
        inputProps={{ maxLength: 3 }}
      />

      <Typography variant="h5" sx={{ fontWeight: 500 }}>
        {" / " + (numPages || 0)}
      </Typography>
    </Box>
  );
}
