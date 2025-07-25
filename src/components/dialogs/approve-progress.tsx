/** @format */

"use client";
import {
  Dialog,
  Box,
  CircularProgress,
  Typography,
  CircularProgressProps,
} from "@mui/material";
import React from "react";

interface ApproveProgressProps extends CircularProgressProps {
  value: number;
  isLoading: boolean;
}

export default function ApproveProgress(props: ApproveProgressProps) {
  const [progress, setProgress] = React.useState(10);
  const { value, isLoading, ...circularProps } = props;
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    // <Dialog
    //   open={isLoading}
    //   disableEscapeKeyDown
    //   fullScreen
    //   sx={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     "& .MuiDialog-paper": {
    //       backgroundColor: "transparent",
    //       boxShadow: "none",
    //     },
    //   }}
    // >
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
        Preprocessing Files
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgressWithLabel value={progress} />
      </Box>
    </Box>
    // </Dialog>
  );
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          color: "#90caf9",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "#90caf9" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
