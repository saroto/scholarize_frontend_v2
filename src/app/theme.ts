/** @format */

"use client";
import { createTheme } from "@mui/material";
import { Roboto, Inter } from "next/font/google";

// Configure the Roboto font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"], // Roboto weights
  display: "swap",
});

// MUI theme configuration
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#FAFAFA",
    },
    error: {
      main: "#D3180C",
      light: "#FFE5E5",
    },
    success: {
      main: "#0DB583",
      light: "#5BD56C",
    },
    background: {
      default: "#f5f6fa",
      paper: "#fff",
    },
    text: {
      primary: "#34322D",
      secondary: "#707070",
      disabled: "#e0e0e0",
    },
  },
  typography: {
    fontFamily: [roboto.style.fontFamily].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "2rem",
    },
    h2: {
      fontSize: "1.5rem",
    },
    h3: {
      fontSize: "1.17rem",
    },
    h4: {
      fontSize: "1rem",
    },
    h5: {
      fontSize: "0.83rem",
    },
    h6: {
      fontSize: "0.75rem",
    },
  },

  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: [
            // "Roboto",
            "Open Sans",
            "Lato",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Poppins, sans-serif"',
          ].join(","),
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          fontFamily: [
            // "Roboto",
            "Open Sans",
            "Lato",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Poppins, sans-serif"',
          ].join(","),
        },
      },
    },
  },
});
