/** @format */

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { toast } from "react-toastify";
export default function FormDialog({
  onClose,
  open,
  task_status_id,
  updateTaskData,
  createTask,
}: // groupId,
{
  onClose: () => void;
  open: boolean;
  task_status_id: string;
  updateTaskData: () => void;
  createTask: (task_title: string, task_status_id: string) => void;
}) {
  const [taskTitle, setTaskTitle] = useState({
    task_title: "",
  });

  const handelCreateTask = async () => {
    try {
      await createTask(taskTitle.task_title, task_status_id);
      //updateTaskData();
      onClose();
      setTaskTitle({ task_title: "" });
    } catch (err) {
      toast.error("You Don't have permission to create task");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle({ ...taskTitle, task_title: event.target.value });
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event?.preventDefault();
            handelCreateTask();
            onClose();
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "1rem",
            minWidth: "35rem",
          },
        }}
      >
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="task"
            name="task"
            label="Task Name"
            type="text"
            fullWidth
            variant="standard"
            value={taskTitle.task_title}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: "1rem",
            gap: "0.5rem",
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              borderRadius: "1rem",
              color: "#999",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{
              borderRadius: "1rem",
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
