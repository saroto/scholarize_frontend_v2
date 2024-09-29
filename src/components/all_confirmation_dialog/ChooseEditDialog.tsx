// ConfirmEditDialog.tsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";

interface ConfirmEditDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (updateType: "current" | "all") => void;
}

export const ConfirmEditDialog: React.FC<ConfirmEditDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedValue, setSelectedValue] = React.useState("current");

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  const handleOk = () => {
    onConfirm(selectedValue as "current" | "all");
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{
      '& .MuiDialog-paper': {
        borderRadius: "1rem",
        minWidth: '35rem'
      }
    }}>
      <DialogTitle>Edit Recurring Schedule</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 1 }}>
          Choose the type of update you would like to perform.
        </DialogContentText>
        <RadioGroup
          name="edit-type"
          value={selectedValue}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="current"
            control={<Radio />}
            label="Current schedule"
          />
          <FormControlLabel
            value="all"
            control={<Radio />}
            label="Current and following schedules"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
