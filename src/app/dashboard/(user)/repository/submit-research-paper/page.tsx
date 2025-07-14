import React from "react";
import { Grid, Typography, Divider, Box, Link, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SubmitForm from "@/components/submitform/submitform";
export default function RepositoryResearchLibrary() {
  return (
    <Box sx={{ width: "100%", padding: 4, overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Distributes left and right properly
          width: "100%", // Ensure it spans the full width
          position: "relative", // For absolute positioning inside
        }}
      >
        <Button
          href="/dashboard/repository/my-publications"
          sx={{
            textDecoration: "none",
            alignItems: "center",
            display: "flex",
            fontSize: "1rem",
            color: "#777777",
            ":hover": {
              textDecoration: "none",
              color: "black",
            },
          }}
        >
          <ArrowBackIcon sx={{ padding: 0, margin: 0 }}></ArrowBackIcon>
          <Typography sx={{ display: "flex" }}>BACK</Typography>
        </Button>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 550,
            margin: "0 auto", // Centered within flex
          }}
        >
          SUBMIT RESEARCH PAPER
        </Typography>
      </Box>

      <Divider
        variant="middle"
        sx={{
          border: 1,
          padding: 0,
          margin: 0,
          color: "#777777",
          marginTop: 2,
          marginBottom: 3,
        }}
      />
      <Grid
        item
        xs={10}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SubmitForm />
      </Grid>
    </Box>
  );
}
