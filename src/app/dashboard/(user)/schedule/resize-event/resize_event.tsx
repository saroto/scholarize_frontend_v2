/** @format */

// src/app/api/service/schedule/resize_event.tsx
"use client";
import { useSession } from "next-auth/react";
import { resizeEvent } from "../../../../api/service/schedule/resizeSchedule"; // Import the resizeEvent function
import { toast } from "react-toastify";
import { SocketContext } from "@/socketio/SocketIOProvider";
import { useContext } from "react";

export const useResizeEvent = (fetchEvents: () => void) => {
  const { data: session } = useSession();
  const socket = useContext(SocketContext);

  const handleEventResize = async (
    resizeInfo: any,
    updateType: "current" | "all",
    notify: boolean
  ) => {
    if (!session || !session.user || !session.user.token) {
      console.error("Authentication required.");
      return;
    }

    const eventData = {
      title: resizeInfo.title,
      start: resizeInfo.start.toISOString(),
      end: resizeInfo.end.toISOString(),
      repeatGroup: resizeInfo.repeatGroup,
      collabID: resizeInfo.collabID,
      id: resizeInfo.id,
    };

    try {
      const response = await resizeEvent(
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
            collabId: resizeInfo.collabID,
            schedulechanged: true,
          });
        }
      } else {
        toast.error("No permission to update event.");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error resizing event:", error);
    }
  };

  return handleEventResize;
};
