import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { on } from "events";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "#ddd",
  p: 4,
};

interface ChatModalProps {
  open: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmTitle?: string;
  confirmDescription?: string;
  closeMenu?: () => void;
}
export default function ChatModal({
  open,
  onClose,
  onConfirm,
  children,
  confirmTitle,
  confirmDescription,
  closeMenu,
}: ChatModalProps & {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        // hideBackdrop
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h3"
              sx={{
                fontWeight: 500,
              }}
            >
              {confirmTitle}
            </Typography>
            <Typography
              id="modal-modal-description"
              variant="body1"
              sx={{ mt: 2 }}
            >
              {confirmDescription}
            </Typography>
            {children && <Box>{children}</Box>}
          </Box>
        </>
      </Modal>
    </div>
  );
}
