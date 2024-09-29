import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  DialogContentText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export default function ConfirmPopup({
  confirmTitle,
  open,
  filename,
  onClose,
  onConfirm,
  closeMenu,
}: {
  confirmTitle: string;
  open: boolean;
  filename?: string;
  closeMenu?: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1rem",
          minWidth: "35rem",
        },
      }}
    >
      <DialogTitle sx={{ textTransform: "capitalize" }}>
        Confirm {confirmTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {filename ? (
            <span>
              Do you want to delete <strong>{filename}</strong>?
            </span>
          ) : (
            <span>Are you sure? All changes cannot be reverted.</span>
          )}
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
          onClick={handleConfirm}
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
          onClick={() => {
            handleClose();
            closeMenu && closeMenu();
          }}
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
}
