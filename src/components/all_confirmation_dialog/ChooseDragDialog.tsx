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
import { useFetchEvents } from "@/app/dashboard/(user)/schedule/view-event/view_event";

interface ChooseDragDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (updateType: "current" | "all") => void;
  fetchEvents?: ReturnType<typeof useFetchEvents>["fetchEvents"];
}

export const ChooseDragDialog: React.FC<ChooseDragDialogProps> = ({
  open,
  onClose,
  onConfirm,
  fetchEvents,
}) => {
  const [selectedValue, setSelectedValue] = React.useState("current");
  const  handleCancel = () => {
    onClose();
    if (fetchEvents) {
      fetchEvents();
    }
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  const handleOk = () => {
    onConfirm(selectedValue as "current" | "all");
    onClose(); // Optionally close the dialog here, or wait for onConfirm processing
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{
      '& .MuiDialog-paper': {
        borderRadius: "1rem",
        minWidth: '35rem'
      }
    }}>
      <DialogTitle>Update Schedule</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 1 }}>
          Choose the type of update you would like to perform.
        </DialogContentText>
        <RadioGroup
          name="update-type"
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
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChooseDragDialog;
