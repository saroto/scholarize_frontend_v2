import type { Metadata } from "next";
import MyPublicationRightSidebar from "@/components/sidebar/my_publication_right_sidebar";
import { Grid, Box, Typography } from "@mui/material";
import ResearchPaperCard from "@/components/card/research_paper_card";

export const metadata: Metadata = {
  title: "My Publications | Scholarize",
};

export default function RepositoryResearchLibrary() {
  return (
    <Grid container minHeight={"100vh"}>
      <Grid container item xs={12}>
        <Grid item xs={10} sm={9.5}>
          <Typography
            variant="h4"
            sx={{
              marginTop: 3,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            MY PUBLISHED RESEACH PAPERS
          </Typography>
          <Grid item container sx={{ margin: "auto" }}>
            <Box sx={{ padding: 2, width: "100%" }}>
              <ResearchPaperCard fetchType="user-specific" />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={2.5} height={"100%"}>
          <MyPublicationRightSidebar disabled={false} />
        </Grid>
      </Grid>
    </Grid>
  );
}
