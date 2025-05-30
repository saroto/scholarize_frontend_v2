/** @format */

import type { Metadata } from "next";
import HodRightSideBar from "@/components/sidebar/hod-right-sidebar";
import ResearchPaperCard from "@/components/card/research_paper_card";
import { Grid, Box, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Submissions | Scholarize",
};

export default function RepositoryResearchLibrary() {
  return (
    <>
      {/* <div id="back-to-top-anchor" /> */}
      <Grid
        container
        minHeight={"100vh"}
        sx={{
          width: "100%",
          overflowY: "hidden",
        }}
      >
        <Grid
          container
          item
          xs={12}
          sx={{ height: "100%", overflowY: "hidden" }}
        >
          <Grid
            item
            xs={10}
            sm={9.5}
            sx={{ height: "100%", overflowY: "auto" }}
          >
            <Typography
              variant="h4"
              sx={{
                marginTop: 3,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              DEPARTMENT SUBMISSIONS
            </Typography>
            <Grid container sx={{ margin: "auto" }}>
              <Box sx={{ p: 2, marginBottom: "3rem" }} width={"100%"}>
                <ResearchPaperCard fetchType="submitted" />
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={3} sm={2.5} height={"100%"}>
            <HodRightSideBar />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
