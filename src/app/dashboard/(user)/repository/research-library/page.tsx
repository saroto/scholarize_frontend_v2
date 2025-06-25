/** @format */

import type { Metadata } from "next";
import ResearchRightSideBar from "@/components/sidebar/research_right_sidebar";
import SearchBar from "@/components/searchbar";
import ResearchPaperCard from "@/components/card/research_paper_card";
import { Grid, Box, Container } from "@mui/material";
export const metadata: Metadata = {
  title: "My Publications | Scholarize",
};

export default function RepositoryResearchLibrary() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <SearchBar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          height: "100%",
          marginBottom: "20px",
          gap: "10px",
          // flexGrow: 1,
        }}
      >
        <ResearchPaperCard fetchType="all" />
      </Box>
    </Box>
  );
}
