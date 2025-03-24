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
  },
  typography: {
    fontFamily: [roboto.style.fontFamily].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
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
