/** @format */

"use client";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Chip, FormControl, Stack, TextField } from "@mui/material";
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
import { RejectDialogProps } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { rejectResearchPaper } from "@/app/api/service/repo/approve-reject/reject";
import PersonIcon from "@mui/icons-material/Person";

import { toast, ToastContainer } from "react-toastify";

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

const RejectDialogs: React.FC<RejectDialogProps> = ({
  reject,
  open,
  onClose,
}) => {
  const [reason, setReason] = useState({ rejected_reason: "" });
  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason({ ...reason, rejected_reason: event.target.value });
  };
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const Reject = async () => {
    const formData = new FormData();
    formData.append("rejected_reason", reason.rejected_reason);
    formData.append("approval_status", reject.approval_status);
    formData.append("research_paper_id", reject.research_paper_id as any);
    setIsLoading(true);
    try {
      await rejectResearchPaper(
        session?.user.token,
        formData,
        reject.research_paper_id as any
      );
      toast.success("Research Paper Rejected Successfully");
      onClose();
      setIsLoading(false);
      router.replace("/dashboard/repository/hod-submission");
    } catch (error) {
      const err = error as Error;
      if (err.message.includes("400")) {
        toast.error("No Reason Provided");
      } else {
        toast.error("Error Rejecting Research Paper");
      }
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <>
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
          REJECT SUBMISSION
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
                  sx={{ fontWeight: 500 }}
                >
                  {reject.research_title}
                </Typography>
              </Stack>
              <Stack direction={"row"}>
                {reject.departments.map((department) => (
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
                <Typography>{reject.research_type.ResearchTypeName}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <PersonIcon />
                <Typography>{reject.author}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <CalendarMonthIcon />
                <Typography>{reject.published_at}</Typography>
              </Stack>
            </Stack>

            <form onSubmit={Reject}>
              <FormControl fullWidth sx={{ height: "auto", marginTop: 2 }}>
                <TextField
                  variant="outlined"
                  label="Reason"
                  required
                  multiline
                  value={reject.rejected_reason}
                  placeholder="Reason..."
                  inputProps={{ style: { minHeight: "5rem", height: "auto" } }}
                  onChange={handleReasonChange}
                />
              </FormControl>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            autoFocus
            onClick={async () => {
              Reject();
              setIsLoading(true);
            }}
            variant="contained"
            color="error"
            disabled={isLoading || reason.rejected_reason === ""}
          >
            Reject
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default RejectDialogs;
