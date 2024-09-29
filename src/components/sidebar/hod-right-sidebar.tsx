"use client";

import { Box, Typography, Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPaperByHOD } from "@/app/api/service/getPaperByHOD";
import { SubmissionPaper } from "@/types";
import { useSubmissionPaperStore } from "@/stores/StoreSubmissionPaper";
import { set } from "lodash";
export default function HodRightSideBar() {
  const { data: session } = useSession();
  const [numberOfPaper, setNumberOfPaper] = useState<SubmissionPaper>();
  const { submissionPaper, setSubmissionPaper } = useSubmissionPaperStore();
  useEffect(() => {
    if (session?.user.token && submissionPaper) {
      setSubmissionPaper(submissionPaper);
      setNumberOfPaper(submissionPaper);
    }
  }, [session?.user.token, submissionPaper]);

  // const numberOfPaper = [{ total: 10, awaiting: 3, rejected: 2 }];
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderLeft: "1px solid #e0e0e0",
      }}
    >
      <Stack
        direction="column"
        spacing={3}
        sx={{ textAlign: "center", justifyContent: "center", paddingTop: 3 }}
      >
        <Stack direction="column" sx={{
          gap: 2,
        }}>
          <Box>
            <Typography variant="h6">Total Submission</Typography>
            <Typography
                variant="h5"
                component="h1"
                sx={{ 
                  justifyContent: "center",
                  color: "blue",
                  fontWeight: "550"}}
              >
                {numberOfPaper?.total_research_papers}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6">Awaiting Approval</Typography>
            <Typography
              variant="h5"
              component="h1"
              sx={{ 
                justifyContent: "center",
                color: "grey",
                fontWeight: "550"}}
            >
               {numberOfPaper?.total_awaiting}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6">Rejected Submission</Typography>
            <Typography
              variant="h5"
              component="h1"
              sx={{ 
                justifyContent: "center",
                color: "red",
                fontWeight: "550"}}
            >
              {numberOfPaper?.total_rejected}
            </Typography>
          </Box>

        </Stack>
      </Stack>
    </Box>
  );
}
