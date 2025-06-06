import { ZoomOut, ZoomIn, RestartAlt } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { Page } from "react-pdf";

export const useZoomWithLoading = (baseWidth: number) => {
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);

  const handleZoom = useCallback((factor: number, reset: boolean = false) => {
    setIsZooming(true); // Start loading state

    setZoom((prevZoom) => {
      const newZoom = reset ? 1 : Math.max(0.5, Math.min(prevZoom + factor, 3));

      // Clear loading state after a short delay (simulates re-render time)
      setTimeout(() => {
        setIsZooming(false);
      }, 300); // Adjust timing based on your PDF rendering speed

      return newZoom;
    });
  }, []);

  const calculatedWidth = useMemo(() => {
    return Math.round(baseWidth * zoom);
  }, [baseWidth, zoom]);

  return {
    zoom,
    calculatedWidth,
    isZooming,
    handleZoom,
    zoomIn: () => handleZoom(0.05),
    zoomOut: () => handleZoom(-0.05),
    resetZoom: () => handleZoom(0, true),
  };
};

// Enhanced zoom controls with loading state
interface SimpleZoomControlsProps {
  zoom: number;
  isZooming: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  numPages: number;
  pageNumber?: number | null;
  inputValue: number | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onkeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  navigate?: () => void;
}

// Even simpler version with just buttons
export const MinimalZoomControls: React.FC<SimpleZoomControlsProps> = ({
  zoom,
  isZooming,
  zoomIn,
  zoomOut,
  resetZoom,
  numPages,
  pageNumber,
  inputValue,
  handleInputChange,
  onkeyPress,
  navigate,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        marginBottom: 2,
      }}
    >
      <IconButton onClick={zoomOut} disabled={zoom <= 0.5 || isZooming}>
        <ZoomOut />
      </IconButton>

      <Typography
        variant="body2"
        sx={{
          minWidth: 60,
          textAlign: "center",
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        {isZooming ? "..." : `${Math.round(zoom * 100)}%`}
      </Typography>

      <IconButton onClick={zoomIn} disabled={zoom >= 3 || isZooming}>
        <ZoomIn />
      </IconButton>

      <IconButton onClick={resetZoom} disabled={isZooming}>
        <RestartAlt />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {" "}
        <TextField
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={onkeyPress}
          onBlur={navigate}
          placeholder={"1"}
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
          {" / " + numPages}
        </Typography>
      </Box>
    </Box>
  );
};
