"use client";
import React, { useEffect, useRef, useState } from "react";
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
import Progressbar from "@/components/Progressbar";
import RichText from "@/components/rich-text/rich-text-preview";

import CircularProgress from "@mui/material/CircularProgress";
import ApproveProgress from "@/components/dialogs/approve-progress";
import ViewPaper from "@/components/viewPaper";
import { redirect, useRouter } from "next/navigation";
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
        public_id: submissionHodPaper?.paper?.public_id,
        approval_status: "approve", // Assuming "approve" is a status you need to pass
        research_title: submissionHodPaper?.paper?.research_title,
        departments: submissionHodPaper?.paper?.departments,
        research_type: submissionHodPaper?.paper?.research_type,
        author: submissionHodPaper?.paper?.author,
        published_at: submissionHodPaper?.paper?.published_at,
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

  const [progress, setProgress] = useState(0);
  const rawPendingPaperData = localStorage.getItem("pendingPaper");
  const pending = JSON.parse(rawPendingPaperData || "{}");
  const maxProgressRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const raw = localStorage.getItem("pendingPaper");
      if (!raw) return;

      try {
        const item = JSON.parse(raw || "{}");

        if (item.status === "published") {
          // If completed, force progress to 100%
          maxProgressRef.current = 100;
          setProgress(100);
          return; // no need to continue with elapsed time calc
        }

        if (item.createdAt && item.duration) {
          const now = Date.now();
          const elapsedSeconds = (now - item.createdAt) / 1000;
          const value = Math.min(100, (elapsedSeconds / item.duration) * 100);

          // Prevent progress from going backward
          if (value >= maxProgressRef.current) {
            maxProgressRef.current = value;
            setProgress(value);
          } else {
            setProgress(maxProgressRef.current);
          }
        }
      } catch (err) {
        console.error("Invalid pendingPaper in localStorage", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const dept = submissionHodPaper?.paper.departments
  //   .map((department) => department.department_name)
  //   .join(", ");
  if (!submissionHodPaper)
    return (
      <div className="p-5 flex justify-center">
        <CircularProgress />
      </div>
    );
  return (
    <>
      {" "}
      <div className="p-5 flex justify-center overflow-auto mb-4">
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
              width: "100%",
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
          {pending &&
            Object.keys(pending).length > 0 &&
            pending?.status !== "published" &&
            pending?.id !== id && (
              <Progressbar
                value={progress}
                step={3}
                intervalMs={1000}
                title={pending.title}
                index={1}
              />
            )}

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
              disabled={
                pending &&
                Object.keys(pending).length > 0 &&
                pending.status !== "published"
                  ? true
                  : false
              }
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
              disabled={
                pending &&
                Object.keys(pending).length > 0 &&
                pending.status !== "published"
                  ? true
                  : false
              }
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
      {/* <ApproveProgress value={10} isLoading={true} /> */}
    </>
  );
}
