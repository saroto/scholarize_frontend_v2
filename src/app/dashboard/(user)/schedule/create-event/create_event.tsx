/** @format */

"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  InputAdornment,
  Grid,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  fetchCollaborations,
  createEvent,
} from "@/app/api/service/schedule/createSchedule"; // Import the new functions
import NotifyMembersDialog from "@/components/all_confirmation_dialog/NotifyMembersDialog"; // Import the notification dialog
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import { SocketContext } from "@/socketio/SocketIOProvider";

export const CreateEventDialog = ({
  open,
  onClose,
  startStr,
  endStr,
  fetchEvents,
  selectedGroups,
  collabInfo,
}: any) => {
  const { data: session } = useSession();
  const timeZone = "UTC";
  const startDate = startStr
    ? toZonedTime(parseISO(startStr), timeZone)
    : new Date();
  const endDate = endStr ? toZonedTime(parseISO(endStr), timeZone) : new Date();
  const formattedDate = `${
    startDate ? format(startDate, "EEEE, MMMM do yyyy") : ""
  } - ${startDate ? format(startDate, "p") : ""} to ${
    endDate ? format(endDate, "p") : ""
  }`;

  const [title, setTitle] = useState<string>("");
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [selectedCollabs, setSelectedCollabs] = useState<string[]>([]);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [repeatWeeks, setRepeatWeeks] = useState<number>(1);
  const [showNotifyDialog, setShowNotifyDialog] = useState<boolean>(false);
  const [tempEventData, setTempEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collabID, setCollabID] = useState<string>("");
  const pathname = usePathname();
  const isInCollab = pathname?.startsWith("/dashboard/collaboration/group");
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (session && open) {
      if (isInCollab) {
        setCollaborations(collabInfo);
        setSelectedCollabs(selectedGroups);
      } else {
        fetchCollaborations(session.user.token)
          .then((data) => {
            setCollaborations(data.data.collab_list.active);
            // setSelectedCollabs(
            //   data.collab_list.active.map((collab: any) =>
            //     collab.collab_id.toString()
            //   )
            // );
          })
          .catch((err) => console.error("Error fetching collaborations:", err));
      }
    }
  }, [session, open]);

  const handleSubmit = async () => {
    if (!session || selectedCollabs.length === 0) {
      return;
    }

    setIsLoading(true);

    if (selectedCollabs.length === 1) {
      setCollabID(selectedCollabs[0]);
      const eventData = {
        ScheduleTitle: title,
        ScheduleTimeStart: startStr,
        ScheduleTimeEnd: endStr,
        RepeatInterval: repeat ? repeatWeeks : 0,
      };
      setTempEventData(eventData);
    } else {
      const eventData = {
        collab_ids: selectedCollabs.map(Number),
        ScheduleTitle: title,
        ScheduleTimeStart: startStr,
        ScheduleTimeEnd: endStr,
        RepeatInterval: repeat ? repeatWeeks : 0,
      };
      setTempEventData(eventData);
    }
    setShowNotifyDialog(true);
  };

  const handleNotifyDecision = async (notify: boolean) => {
    if (!session || !tempEventData) {
      return;
    }

    const eventDataWithNotify = {
      ...tempEventData,
      notify,
    };
    if (tempEventData.RepeatInterval > 20) {
      toast.error("Repeat should be more than 20 weeks");
      setIsLoading(false);
      return;
    }
    try {
      const response = await createEvent(
        eventDataWithNotify,
        session.user.token,
        notify,
        collabID
      );

      if (response.error) {
        if (response.error?.error.startsWith("Schedule")) {
          toast.error(response.error.error);
        } else {
          toast.error("No permission to create event");
        }
      } else {
        if (response.notify) {
          toast.success("Event created and members notified");
        } else {
          toast.success("Event created");
        }
        onClose();
        setTitle("");
        setSelectedCollabs([]);
        setRepeat(false);
        setRepeatWeeks(1);

        if (socket) {
          socket.emit("schedule", {
            collabId: collabID,
            schedulechanged: true,
          });
        }
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        sx={{
          ".MuiDialog-paper": {
            borderRadius: "1rem",
          },
        }}
      >
        <DialogContent
          sx={{
            padding: "2rem",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
            }}
            onClick={() => {
              onClose();
              setTitle("");
              setSelectedCollabs([]);
              setRepeat(false);
              setRepeatWeeks(1);
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333333",
              marginBottom: "0.6rem",
            }}
          >
            {formattedDate}
          </Typography>

          <TextField
            autoFocus
            margin="normal"
            id="title"
            label="Add title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <InputLabel
            id="collab-label"
            sx={{
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#333333",
              fontWeight: 550,
            }}
          >
            APPLIES TO
          </InputLabel>
          <FormControl fullWidth>
            <Select
              labelId="collab-label"
              id="collab-select"
              multiple
              value={selectedCollabs}
              disabled={collaborations.length === 0 || isInCollab}
              onChange={(e) => setSelectedCollabs(e.target.value as string[])}
              renderValue={(selected) => {
                if (Array.isArray(selected)) {
                  return selected
                    .map(
                      (id) =>
                        collaborations.find(
                          (c) => c.collab_id && c.collab_id.toString() === id
                        )?.collab_name
                    )
                    .join(", ");
                }
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {collaborations
                .filter((collab) => collab.collab_id)
                .map((collab: any) => (
                  <MenuItem
                    key={collab.collab_id}
                    value={collab.collab_id.toString()}
                  >
                    <Checkbox
                      checked={selectedCollabs.includes(
                        collab.collab_id.toString()
                      )}
                    />
                    <ListItemText primary={collab.collab_name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormGroup
            sx={{
              paddingTop: "2rem",
              height: "4rem",
            }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={repeat}
                      onChange={(event) => setRepeat(event.target.checked)}
                      size="medium"
                    />
                  }
                  label="Repeat"
                />
              </Grid>
              {repeat && (
                <Grid item style={{ flex: 1 }}>
                  <TextField
                    id="repeat-weeks"
                    label="Repeat weekly for"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={repeatWeeks}
                    onChange={(event) => {
                      if (Number(event.target.value) > 20) {
                        setRepeatWeeks(20);
                      } else if (Number(event.target.value) < 1) {
                        setRepeatWeeks(1);
                      } else {
                        setRepeatWeeks(Number(event.target.value));
                      }
                    }}
                    sx={{
                      "& input": {
                        height: "0.75rem",
                        width: "4rem",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">week(s)</InputAdornment>
                      ),
                      inputProps: {
                        min: 1,
                        max: 20,
                        style: { textAlign: "center" },
                      },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </FormGroup>
        </DialogContent>

        <DialogActions
          sx={{
            paddingRight: "2rem",
            paddingBottom: "1.5rem",
          }}
        >
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={title === "" || selectedCollabs.length === 0 || isLoading}
            sx={{
              padding: "0.5rem 2rem",
              borderRadius: "2rem",
              backgroundColor:
                title === "" || selectedCollabs.length === 0 || isLoading
                  ? "#e0e0e0"
                  : "#333333",
              color:
                title === "" || selectedCollabs.length === 0 || isLoading
                  ? "#9e9e9e"
                  : "white",
              "&:hover": {
                backgroundColor:
                  title === "" || selectedCollabs.length === 0 || isLoading
                    ? "#e0e0e0"
                    : "#3f51b5",
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <NotifyMembersDialog
        open={showNotifyDialog}
        onClose={() => setShowNotifyDialog(false)}
        onConfirm={handleNotifyDecision}
        onCanceled={() => setIsLoading(false)}
      />
    </>
  );
};
