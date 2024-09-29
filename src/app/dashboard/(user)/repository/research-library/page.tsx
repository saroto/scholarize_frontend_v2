/** @format */

import type { Metadata } from "next";
import ResearchRightSideBar from "@/components/sidebar/research_right_sidebar";
import SearchBar from "@/components/searchbar";
import ResearchPaperCard from "@/components/card/research_paper_card";
import { Grid, Box } from "@mui/material";
export const metadata: Metadata = {
  title: "My Publications | Scholarize",
};

export default function RepositoryResearchLibrary() {
  return (
    <Grid container minHeight={"100vh"}>
      <Grid container item xs={12}>
        <Grid item xs={10} sm={9.5}>
          <SearchBar />
          <Grid container sx={{ margin: "auto" }}>
            <Box
              sx={{
                padding: 2,
                pt: 0,
                width: "100%",
              }}
            >
              <ResearchPaperCard fetchType="all" />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={2.5}>
          <ResearchRightSideBar />
        </Grid>
      </Grid>
    </Grid>
  );
}
