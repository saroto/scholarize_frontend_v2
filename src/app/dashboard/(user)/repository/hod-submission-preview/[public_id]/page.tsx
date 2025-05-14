"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Link,
  FormControl,
  Stack,
  Button,
  Typography,
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
    <Box sx={{ width: "100%", padding: 4, overflowY: "auto" }}>
      <FormControl fullWidth>
        <Button
          href="/dashboard/repository/hod-submission"
          sx={{
            textDecoration: "none",
            alignItems: "center",
            display: "flex",
            height: "auto",
            position: "absolute",
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
          variant="h4"
          sx={{
            marginBottom: 3,
            textAlign: "center",
            alignItems: "center",
            fontWeight: "550",
          }}
        >
          Submission Preview
        </Typography>

        <ViewPaper viewPaper={submissionHodPaper} />
      </FormControl>

      {/* <Stack direction="column">
        <InputLabel id="rich-text" sx={{ color: "black", fontWeight: "550" }}>
          FULL TEXT
        </InputLabel>
      </Stack> */}

      <Stack direction="column" sx={{ marginTop: 2 }} width={"100%"}>
        <RichText rich_text={submissionHodPaper?.full_text} />
      </Stack>

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
        >
          Approve
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="error"
          sx={{
            marginLeft: 2,
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
  );
}
