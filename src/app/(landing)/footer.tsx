import { Box, Typography } from "@mui/material";

export default function LandingFooter() {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          padding: "1rem",
          fontWeight: 300,
          color: "text.secondary",
        }}
      >
        Copyright © All Rights Reserved. 2024, PARAGON International University
        Powered by the Center for Applied Research and Development Initiative
        (RaDICe)
      </Typography>
    </Box>
  );
}
