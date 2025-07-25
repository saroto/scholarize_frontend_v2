/** @format */

"use client";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Chip, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { approveResearchPaper } from "@/app/api/service/repo/approve-reject/approve";
import { ApproveDialogProps } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import ErrorIcon from "@mui/icons-material/Error";
import ApproveProgress from "./approve-progress";
import Progressbar from "../Progressbar";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "1rem",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
}));

const ApproveDialogs: React.FC<ApproveDialogProps> = ({
  approve,
  onClose,
  open,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  console.log("approve", approve);
  const router = useRouter();
  const Approve = async () => {
    setIsLoading(true);
    try {
      const researchPaperId = approve.research_paper_id as any;
      const researchPaperPublicId = approve.public_id as any;
      const approvalStatus = approve.approval_status as any;
      const approveTitle = approve.research_title as any;

      const now = Date.now();
      const expiresAt = now + 20_000;

      const pendingPaper = {
        id: researchPaperPublicId,
        title: approveTitle,
        status: "in_progress",
        createdAt: now,
        duration: 20,
        expiresAt: expiresAt,
      };

      localStorage.setItem("pendingPaper", JSON.stringify(pendingPaper));

      //Optimistic navigation BEFORE backend response
      setTimeout(() => {
        router.replace("/dashboard/repository/hod-submission");
      }, 100);
      onClose();
      setIsLoading(false);

      // Call the actual backend approval in the background
      const response = await approveResearchPaper(
        session?.user.token,
        researchPaperId,
        approvalStatus,
        approve.approval_email
      );

      //  Update localStorage status after approval is confirmed
      if (response && response.success) {
        const updated = {
          ...pendingPaper,
          status: "published",
          completedAt: Date.now(),
        };
        localStorage.setItem("pendingPaper", JSON.stringify(updated));
        localStorage.removeItem(`approval-${researchPaperId}`);
      } else {
        toast.error("Failed to Approve Research Paper");
      }
    } catch (error) {
      toast.error("Failed to Approve Research Paper");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

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

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center" }}
        id="customized-dialog-title"
      >
        APPROVE SUBMISSION
        <IconButton
          aria-label="close"
          onClick={handleClose} // Use onClose prop to close dialog
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="p-2">
          <Stack direction={"row"} spacing={2}>
            <Stack>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                color={"black"}
                sx={{
                  fontWeight: 500,
                }}
              >
                {approve.research_title}
              </Typography>
            </Stack>
            <Stack direction={"row"}>
              {approve.departments.map((department) => (
                <Box key={department.department_id} sx={{ display: "flex" }}>
                  <Chip
                    label={department.department_tag}
                    sx={{
                      color: "#fff",
                      marginRight: 0.5,
                      background: department.department_color,
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{ paddingTop: 1, paddingBottom: 1 }}
          >
            <Stack direction="row" spacing={1}>
              <ArticleIcon />
              <Typography>{approve.research_type.ResearchTypeName}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <PersonIcon />
              <Typography>{approve.author}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <CalendarMonthIcon />
              <Typography>{approve.published_at}</Typography>
            </Stack>
          </Stack>
        </div>
        {pending &&
          Object.keys(pending).length > 0 &&
          pending.status !== "published" && (
            <Progressbar
              value={progress}
              step={3}
              intervalMs={1000}
              title={pending.title}
              index={0}
            />
          )}
      </DialogContent>

      <DialogActions>
        <Button
          autoFocus
          onClick={async () => {
            Approve();
            setIsLoading(true);
          }}
          variant="contained"
          color="success"
          sx={{ backgroundColor: { hover: "green" } }}
          disabled={isLoading}
        >
          Approve
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ApproveDialogs;
