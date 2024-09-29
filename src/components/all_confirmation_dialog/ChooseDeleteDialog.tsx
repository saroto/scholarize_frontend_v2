import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  DialogActions,
} from "@mui/material";

const ChooseDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState("current");
  const handleCancel = () => {
    onClose();
  }

  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{
      '& .MuiDialog-paper': {
        borderRadius: "1rem",
        minWidth: '35rem'
      },
    }}>
      <DialogTitle>Delete Event</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 1 }}>
          Choose the type of deletion you would like to perform.
        </DialogContentText>
        <RadioGroup
          name="delete-type"
          value={selectedValue}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="current"
            control={<Radio />}
            label="Delete current schedule"
          />
          <FormControlLabel
            value="all"
            control={<Radio />}
            label="Delete current and following schedules"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={() => onConfirm(selectedValue)} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChooseDeleteDialog;
