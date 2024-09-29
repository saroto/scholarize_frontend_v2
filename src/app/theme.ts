/** @format */

"use client";
import { createTheme } from "@mui/material";

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
    fontFamily: [
      "Roboto",
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

  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: [
            "Roboto",
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
            "Roboto",
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
