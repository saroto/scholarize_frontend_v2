/** @format */

// src/app/service/schedule/detail_event.tsx
"use client";
import React, { useContext, useState } from "react";
import { Dialog, DialogContent, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { format, parseISO, isDate } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { deleteEvent } from "@/app/api/service/schedule/deleteSchedule"; // Import deleteEvent
//import deleteEvent from "@/app/api/service/schedule/delete_event"; // Import deleteEvent
import ChooseDeleteDialog from "@/components/all_confirmation_dialog/ChooseDeleteDialog";
import { useSession } from "next-auth/react"; // Import useSession
import LayersIcon from "@mui/icons-material/Layers";
import NotifyMembersDialog from "@/components/all_confirmation_dialog/NotifyMembersDialog";

import { toast } from "react-toastify";
import { SocketContext } from "@/socketio/SocketIOProvider";

const EventDetailsDialog = ({
  open,
  eventInfo,
  onClose,
  onEdit,
  onDeleteSuccess,
  onDeleteFailure,
  archiveStatus,
}: {
  open: boolean;
  eventInfo: any; // Replace 'any' with the actual type of eventInfo
  onClose: () => void;
  onEdit: (eventInfo: any) => void; // Replace 'any' with the actual type of eventInfo
  onDeleteSuccess: (deletedEventId: string) => void;
  onDeleteFailure: (error: Error) => void;
  archiveStatus?: boolean;
}) => {
  if (!eventInfo) return null;
  const { data: session } = useSession(); // Get session data
  const timeZone = "UTC"; // Define your time zone, in this case, UTC

  // Validate and parse dates
  const parseDate = (date: any) => {
    try {
      return isDate(date) ? date : parseISO(date);
    } catch (error) {
      return new Date();
    }
  };

  const startDate = toZonedTime(parseDate(eventInfo.start), timeZone);
  const endDate = toZonedTime(parseDate(eventInfo.end), timeZone);

  const formattedStart = format(startDate, "EEEE, MMMM do yyyy - h:mm a");
  const formattedEnd = format(endDate, "h:mm a");

  const [chooseDeleteOpen, setChooseDeleteOpen] = useState(false);
  const [showNotifyDialog, setShowNotifyDialog] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<"current" | "all">("current");
  const [isDeleting, setIsDeleting] = useState(false);
  const socket = useContext(SocketContext);

  const handleDeleteClick = () => {
    if (!eventInfo.repeatGroup) {
      setDeleteType("current");
      setShowNotifyDialog(true);
    } else {
      setChooseDeleteOpen(true);
    }
    setIsDeleting(true);
  };

  const handleNotifyDecision = async (notify: boolean) => {
    if (!session || !eventInfo) {
      return;
    }

    const result = await deleteEvent(
      eventInfo.id,
      eventInfo.collabID,
      eventInfo.repeatGroup,
      deleteType === "all",
      session.user.token,
      notify
    );

    if (result && result.success) {
      onDeleteSuccess(eventInfo.id);
      setChooseDeleteOpen(false);
      setShowNotifyDialog(false);
      onClose();
      if (result && result.notify) {
        toast.success("Event deleted successfully and notified");
      } else {
        toast.success("Event deleted successfully");
      }
      if (socket) {
        socket.emit("schedule", {
          collabId: eventInfo.collabID,
          schedulechanged: true,
        });
      }
    } else {
      toast.error(result && result.error.error);
    }
    setIsDeleting(false);
  };

  const handleDeleteChoice = (deleteType: any) => {
    setDeleteType(deleteType);
    setShowNotifyDialog(true);
    setChooseDeleteOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1rem",
          minWidth: "30rem",
        },
      }}
    >
      <DialogContent
        sx={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div className="grid px-3 w-full">
          <div className="flex flex-row justify-end w-full">
            {!archiveStatus && (
              <>
                <IconButton onClick={() => onEdit(eventInfo)}>
                  <EditIcon />
                </IconButton>
                <IconButton disabled={isDeleting} onClick={handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="p-2 grid gap-4 w-full">
            <div className="flex flex-row gap-5 align-middle w-full">
              <div className="flex">
                <div
                  className="rounded-[0.4rem] w-[2rem] h-[2rem] shadow-md"
                  style={{
                    backgroundColor: eventInfo.backgroundColor
                      ? eventInfo.backgroundColor
                      : "#3688d8",
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 flex-nowrap w-full">
                <div className="my-auto font-sans text-[1.2rem] w-[28rem] line-clamp-4 break-words">
                  {eventInfo.title}
                </div>
                <div className="flex text-[#777777] my-auto font-sans text-[1.2rem]">
                  {formattedStart} - {formattedEnd}
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-5 align-middle">
              <div className="flex">
                <LayersIcon
                  sx={{
                    width: "2rem",
                    height: "2rem",
                    color: "#333333",
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 mb-2">
                <div className=" my-auto font-[550] italic font-sans text-[1.2rem] text-[#333333] w-[28rem] block truncate">
                  {eventInfo.collabName || "Unknown Collaboration"}
                </div>
                <div className="flex text-[#777777] my-auto font-sans text-[1.2rem]">
                  Created by {eventInfo.userName || "Unknown Collaboration"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChooseDeleteDialog
          open={chooseDeleteOpen}
          onClose={() => setChooseDeleteOpen(false)}
          onConfirm={handleDeleteChoice}
        />
        <NotifyMembersDialog
          open={showNotifyDialog}
          onClose={() => setShowNotifyDialog(false)}
          onConfirm={handleNotifyDecision}
          onCanceled={() => setIsDeleting(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
