/** @format */

"use client";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DashboardButton from "@/components/navbar/DashboardButton";

export default function Navbar() {
  return (
    <AppBar
      component="nav"
      position="fixed"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        paddingInline: {
          lg: "100px",
        },
      }}
    >
      <Toolbar>
        <Stack
          title="Scholarize"
          direction={"row"}
          alignItems={"center"}
          sx={{ flexGrow: 1 }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            onClick={() => {
              window.location.href = "/";
            }}
            sx={{
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: "1rem",
              },
              padding: "0.5rem",
            }}
          >
            <img src="/logo.png" alt="Scholarize" width={30} height={30} />

            <Typography
              variant="h5"
              component="h5"
              sx={{
                color: "black",
                fontWeight: "500",
                fontFamily: "poppins, -apple-system",
              }}
            >
              Scholarize
            </Typography>
          </Stack>
        </Stack>
        <Tooltip title="About Scholarize" placement="bottom">
          <IconButton
            sx={{
              color: "black",
              mr: 1,
              // ":hover": {
              //   backgroundColor: "rgba(0, 0, 0, 0.1)",
              //   borderRadius: "1rem",
              //   color: "blue",
              // },
            }}
            onClick={() => {
              window.location.href = "/about";
            }}

            // onClick={() => {
            //   // Open in new window
            //   const aboutPage =
            //     "https://sites.google.com/paragoniu.edu.kh/scholarize/about";
            //   const newWindow = window.open(
            //     aboutPage,
            //     "_blank",
            //     "noopener,noreferrer"
            //   );
            //   if (newWindow) newWindow.opener = null;
            // }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <DashboardButton />
      </Toolbar>
    </AppBar>
  );
}
