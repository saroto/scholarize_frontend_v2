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
import { useState } from "react";
import { approveResearchPaper } from "@/app/api/service/repo/approve-reject/approve";
import { ApproveDialogProps } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";

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
  const router = useRouter();
  const Approve = async () => {
    setIsLoading(true);
    try {
      const response = await approveResearchPaper(
        session?.user.token,
        approve.research_paper_id as any,
        approve.approval_status as any
      );
      if (response && response.success) {
        toast.success("Research Paper Approved Successfully");
        setIsLoading(false);
        onClose();
        router.replace("/dashboard/repository/hod-submission");
      } else {
        toast.error("Failed to Approve Research Paper");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      toast.error("Failed to Approve Research Paper");
      setIsLoading(false);
      return;
    }
  };

  const handleClose = () => {
    onClose();
  };
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
                variant="h5"
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
