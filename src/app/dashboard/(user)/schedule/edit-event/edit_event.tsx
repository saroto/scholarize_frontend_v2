/** @format */

// src/app/dashboard/(user)/schedule/edit-event/edit_event.tsx
"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { ConfirmEditDialog } from "@/components/all_confirmation_dialog/ChooseEditDialog";
import NotifyMembersDialog from "@/components/all_confirmation_dialog/NotifyMembersDialog";
import { useSession } from "next-auth/react";
import { editEvent } from "../../../../api/service/schedule/editSchedule"; // Import the editEvent function

import { toast } from "react-toastify";
import { SocketContext } from "@/socketio/SocketIOProvider";

interface EventInfo {
  id: any;
  title: string;
  start: string;
  end: string;
  collabID?: string;
  repeatGroup?: string;
}

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  eventInfo: EventInfo;
  fetchEvents: () => void;
  onSaved?: () => void;
  OnDelete?: () => void;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  onClose,
  eventInfo,
  fetchEvents,
  onSaved,
  OnDelete,
}) => {
  const [title, setTitle] = useState(eventInfo.title);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const { data: session } = useSession();
  const [updateType, setUpdateType] = useState<"current" | "all">("current");
  const socket = useContext(SocketContext);

  useEffect(() => {
    setTitle(eventInfo.title);
  }, [eventInfo]);

  const handleSave = async () => {
    if (!session || !session.user || !session.user.token) {
      return;
    }
    if (eventInfo.repeatGroup) {
      setConfirmOpen(true);
    } else {
      setNotifyOpen(true);
    }
  };

  const handleConfirmSave = async (selectedUpdateType: "current" | "all") => {
    setUpdateType(selectedUpdateType);
    setConfirmOpen(false);
    setNotifyOpen(true);
  };

  const handleNotifyConfirm = async (notify: boolean) => {
    setNotifyOpen(false);
    const eventData = {
      title,
      start: eventInfo.start,
      end: eventInfo.end,
      repeatGroup: eventInfo.repeatGroup,
      collabID: eventInfo.collabID,
      id: eventInfo.id,
    };

    try {
      if (session && session.user && session.user.token) {
        const response = await editEvent(
          eventData,
          session.user.token,
          updateType,
          notify
        );

        if (response && response.success) {
          if (notify) {
            toast.success("Event updated and members notified!");
          } else {
            toast.success("Event updated!");
          }
          if (socket) {
            socket.emit("schedule", {
              collabId: eventInfo.collabID,
              schedulechanged: true,
            });
          }
          onClose();
          onSaved && onSaved();
        } else {
          toast.error("No permission to edit this event");
          onClose();
          fetchEvents();
        }
      }
    } catch (error) {
      console.error("Error updating the event: ", error);
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          borderRadius: "0.7rem",
        },
      }}
    >
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          id="title"
          label="Event Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={title === ""} color="primary">
          Save
        </Button>
      </DialogActions>
      <ConfirmEditDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />
      <NotifyMembersDialog
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        onConfirm={handleNotifyConfirm}
      />
    </Dialog>
  );
};

export default EditEventDialog;
