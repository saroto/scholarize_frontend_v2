"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Link,
  FormControl,
  Stack,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RejectDialog from "@/components/dialogs/reject-dialog";
import ApproveDialog from "@/components/dialogs/approve-dialog";
import { getPaperByHODById } from "@/app/api/service/getPaperByHOD";
import { useSession } from "next-auth/react";
import { submissionsHodPaper } from "@/types";

import RichText from "@/components/rich-text/rich-text-preview";

import CircularProgress from "@mui/material/CircularProgress";
import ViewPaper from "@/components/viewPaper";
interface submissionPropParam {
  public_id: string;
}

export default function submissionPreview({
  params,
}: {
  params: submissionPropParam;
}) {
  const { data: session } = useSession();
  const id = params.public_id;
  const [submissionHodPaper, setsubmissionHodPaper] =
    useState<submissionsHodPaper>();
  // approve dialog
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approveData, setApproveData] = useState<any>();
  const [rejectData, setRejectData] = useState<any>();

  const handleApproveDialogClose = () => {
    setIsApprovalDialogOpen(false);
  };
  const handleRejectDialogClose = () => {
    setIsRejectDialogOpen(false);
  };

  const handleOpenRejectDialog = () => {
    if (submissionHodPaper) {
      const rejectData = {
        research_paper_id: submissionHodPaper.paper.research_paper_id,
        approval_status: "reject", // Assuming "reject" is a status you need to pass
        research_title: submissionHodPaper.paper.research_title,
        departments: submissionHodPaper.paper.departments,
        research_type: submissionHodPaper.paper.research_type,
        author: submissionHodPaper.paper.author,
        published_at: submissionHodPaper.paper.published_at,
      };

      setRejectData(rejectData); // You need to have this state set up to hold the data
      setIsRejectDialogOpen(true);
    }
  };

  const handleOpenApproveDialog = () => {
    if (submissionHodPaper) {
      const approveData = {
        research_paper_id: submissionHodPaper?.paper?.research_paper_id,
        approval_status: "approve", // Assuming "approve" is a status you need to pass
        research_title: submissionHodPaper?.paper?.research_title,
        departments: submissionHodPaper?.paper?.departments,
        research_type: submissionHodPaper?.paper?.research_type,
        author: submissionHodPaper?.paper?.author,
        published_at: submissionHodPaper?.paper?.published_at,
        approval_email: session?.user.email,
      };
      setApproveData(approveData); // You need to have this state set up to hold the data
      setIsApprovalDialogOpen(true);
    }
  };

  useEffect(() => {
    if (session?.user.token && id) {
      const fetchPaper = async () => {
        try {
          const data = await getPaperByHODById(session, String(id));
          setsubmissionHodPaper(data);
        } catch (error) {
          console.error("Failed to load research paper", error);
        }
      };
      fetchPaper();
    }
  }, [session?.user.token, id]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const dept = submissionHodPaper?.paper.departments
  //   .map((department) => department.department_name)
  //   .join(", ");
  if (!submissionHodPaper)
    return (
      <div className="flex justify-center p-5">
        <CircularProgress />
      </div>
    );
  return (
    <div className="flex justify-center p-5 mb-4 overflow-auto">
      <Box
        sx={{
          width: isSmallScreen ? "100%" : "60%",
          display: "flex",
          height: "100%",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Distributes left and right properly
            width: "100%", // Ensure it spans the full width
            position: "relative", // For absolute positioning inside
          }}
        >
          {!isSmallScreen && (
            <Button
              href="/dashboard/repository/hod-submission"
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
              <ArrowBackIcon sx={{ padding: 0, margin: 0 }} />
              <Typography sx={{ display: "flex" }}>BACK</Typography>
            </Button>
          )}

          {isSmallScreen && (
            <IconButton
              href="/dashboard/repository/hod-submission"
              size="small"
            >
              <ArrowBackIcon sx={{ padding: 0, margin: 0 }} />
            </IconButton>
          )}

          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 550,
              margin: "0 auto", // Centered within flex
            }}
          >
            Submission Preview
          </Typography>

          {/* Optional: Placeholder to balance space */}
          <Box sx={{ width: "80px" }}></Box>
        </Box>

        <Divider
          sx={{
            width: "100%",
          }}
        />
        <FormControl fullWidth>
          <ViewPaper viewPaper={submissionHodPaper} />
        </FormControl>

        {/* <Stack direction="column">
        <InputLabel id="rich-text" sx={{ color: "black", fontWeight: "550" }}>
          FULL TEXT
        </InputLabel>
      </Stack> */}

        {/* <Stack direction="column" sx={{ marginTop: 2 }} width={"100%"}>
        <RichText rich_text={submissionHodPaper?.full_text} />
      </Stack> */}

        <Box
          sx={{
            justifyContent: "center",
            display: "flex",
            marginTop: 3,
            marginBottom: 4,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleOpenApproveDialog}
            sx={{
              borderRadius: "16px",
              color: "white",
              boxShadow: "none",
            }}
          >
            Approve
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            sx={{
              borderRadius: "16px",
              marginLeft: 2,
              boxShadow: "none",
            }}
            onClick={handleOpenRejectDialog}
          >
            Reject
          </Button>
          {isApprovalDialogOpen && approveData && (
            <ApproveDialog
              open={isApprovalDialogOpen}
              onClose={handleApproveDialogClose}
              approve={approveData}
            />
          )}
          {isRejectDialogOpen && rejectData && (
            <RejectDialog
              open={isRejectDialogOpen}
              onClose={handleRejectDialogClose}
              reject={rejectData}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}
