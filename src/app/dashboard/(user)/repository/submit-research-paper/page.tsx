import React from "react";
import { Grid, Typography, Divider, Box, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SubmitForm from "@/components/submitform/submitform";
export default function RepositoryResearchLibrary() {
  return (
    <Box sx={{ width: "100%", padding: 4, overflow: "auto" }}>
      <Link
        href="/dashboard/repository/my-publications"
        sx={{
          textDecoration: "none",
          alignItems: "center",
          display: "flex",
          height: "auto",
          // position: "absolute",
          fontSize: "1rem",
          color: "#777777",
          ":hover": {
            textDecoration: "none",
            color: "blue",
          },
        }}
      >
        <ArrowBackIcon sx={{ padding: 0, margin: 0 }}></ArrowBackIcon>
        <span className="flex">BACK</span>
      </Link>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          alignItems: "center",
          fontWeight: "550",
        }}
      >
        SUBMIT RESEARCH PAPER
      </Typography>

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
