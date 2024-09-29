// src/components/all_confirmation_dialog/NotifyMembersDialog.tsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFetchEvents } from "@/app/dashboard/(user)/schedule/view-event/view_event";

interface NotifyMembersDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notify: boolean) => void;
  fetchEvents?: ReturnType<typeof useFetchEvents>["fetchEvents"];
  onCanceled?: () => void;
}

const NotifyMembersDialog: React.FC<NotifyMembersDialogProps> = ({
  open,
  onClose,
  onConfirm,
  fetchEvents,
  onCanceled,
}) => {
  const handleYes = () => {
    onConfirm(true);
    onClose();
  };

  const handleClose = () => {
    onClose();
    if (onCanceled) {
      onCanceled();
    }
    if (fetchEvents) {
      fetchEvents();
    }
  };

  const handleNo = () => {
    onConfirm(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1rem",
          minWidth: "35rem",
        },
      }}
    >
      <DialogTitle>Send E-Mail Notification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Notify all members in the group about the changes?
        </DialogContentText>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "1rem",
          gap: "0.5rem",
        }}
      >
        <Button
          onClick={handleYes}
          sx={{
            borderRadius: "1rem",
            backgroundColor: "#f5f5f5",
            color: "#999",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#555555",
            },
          }}
        >
          Yes
        </Button>
        <Button
          onClick={handleNo}
          sx={{
            backgroundColor: "#555555",
            borderRadius: "1rem",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#000",
            },
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotifyMembersDialog;
