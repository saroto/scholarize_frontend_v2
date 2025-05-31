/** @format */

"use client";
import { Box, Typography, Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ArticleIcon from "@mui/icons-material/Article";
import { publicResearchPaper } from "@/types";
import { permission } from "@/types";
import Link from "@mui/material/Link";
import { usePublicationPaperStore } from "@/stores/StorePublicationPaper";
import CustomButton from "../customButton";

interface buttonProp {
  disabled: boolean;
}
export default function DashboardRightSideBar({ disabled }: buttonProp) {
  const [publications, setPublications] = useState<publicResearchPaper | null>(
    null
  );
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const { publicePaper, setpublicePaper } = usePublicationPaperStore();

  useEffect(() => {
    if (publicePaper && session?.user.token) {
      setpublicePaper(publicePaper);
      setPublications(publicePaper);
    }
  }, [publicePaper]);

  const awaitingPapersToShow =
    publications?.awaiting_papers?.slice(
      0,
      expanded ? publications.awaiting_papers.length || 0 : 4
    ) || [];
  const rejectedPapersToShow =
    publications?.rejected_papers?.slice(
      0,
      expanded ? publications.rejected_papers.length || 0 : 4
    ) || [];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderLeft: "1px solid #e0e0e0",
      }}
    >
      <Stack direction="column" gap={3} sx={{ padding: 2, paddingTop: 3 }}>
        {session?.user?.role_permissions.map((permission: permission) => {
          return permission.permissions.map((per, i) => {
            if (per === "Publish research paper") {
              return (
                <Stack key={i}>
                  <CustomButton
                    variant="contained"
                    color="primary"
                    startIcon={<ArticleIcon />}
                    href="/dashboard/repository/submit-research-paper"
                    disabled={disabled}
                    sx={{
                      textTransform: "none",
                      px: "1rem",
                      borderRadius: "1rem",
                      boxShadow: "none",
                    }}
                  >
                    Submit Paper
                  </CustomButton>
                </Stack>
              );
            } else {
              return null;
            }
          });
        })}

        <Stack direction="column" spacing={1}>
          <Typography variant="h6" component="h1">
            Awaiting Approval
          </Typography>

          {awaitingPapersToShow?.map((paper) => (
            <Stack direction="row" spacing={1} key={paper.research_paper_id}>
              <ArticleIcon />

              <Link
                href={"/dashboard/repository/awaiting/" + paper.public_id}
                className="truncate truncate-text"
                sx={{
                  textDecoration: "none",
                  ":hover": {
                    textDecoration: "underline",
                    color: "#1976d2",
                    fontFamily: "Roboto",
                  },
                }}
              >
                <Typography>{paper.research_title}</Typography>
              </Link>
            </Stack>
          ))}
          {publications && (publications.awaiting_papers?.length || 0) > 4 && (
            <Box display="flex" justifyContent="flex-start">
              <Button onClick={handleExpandClick} sx={{ color: "purple" }}>
                {expanded ? "Show Less" : "Show More"}
              </Button>
            </Box>
          )}
        </Stack>

        <Stack direction="column" spacing={1}>
          <Typography variant="h6" component="h1">
            Rejected Submission
          </Typography>

          {rejectedPapersToShow.map((paper) => (
            <Stack direction="row" spacing={1} key={paper.research_paper_id}>
              <ArticleIcon />
              <Link
                href={"/dashboard/repository/reject/" + paper.public_id}
                sx={{
                  textDecoration: "none",
                  ":hover": {
                    textDecoration: "underline",
                    color: "red",
                  },
                }}
              >
                <Typography>{paper.research_title}</Typography>
              </Link>
            </Stack>
          ))}

          {publications && (publications.rejected_papers?.length || 0) > 4 && (
            <Box display="flex" justifyContent="flex-start">
              <Button onClick={handleExpandClick} sx={{ color: "purple" }}>
                {expanded ? "Show Less" : "Show More"}
              </Button>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
