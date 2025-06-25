import { Box, Typography } from "@mui/material";

export default function LandingFooter() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: 3,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          fontWeight: 300,
          color: "text.secondary",
        }}
      >
        Copyright © All Rights Reserved. 2024, PARAGON International University.
        Powered by the Center for Applied Research and Development Initiative
        (RaDICe)
      </Typography>
    </Box>
  );
}
