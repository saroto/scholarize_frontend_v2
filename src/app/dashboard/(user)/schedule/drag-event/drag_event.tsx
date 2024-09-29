/** @format */

"use client";
import { useSession } from "next-auth/react";
import { dragEvent } from "../../../../api/service/schedule/dragSchedule";
import { toast } from "react-toastify";
import { SocketContext } from "@/socketio/SocketIOProvider";
import { useContext } from "react";

export const useDragEvent = (fetchEvents: () => void, session: any) => {
  const socket = useContext(SocketContext);

  const handleEventDrop = async (
    eventInfo: any,
    updateType: "current" | "all",
    notify: boolean
  ) => {
    if (!session || !session.user || !session.user.token) {
      console.error("User session is not available.");
      return;
    }

    const eventData = {
      title: eventInfo.title,
      start: eventInfo.start.toISOString(),
      end: eventInfo.end.toISOString(),
      repeatGroup: eventInfo.repeatGroup,
      collabID: eventInfo.collabID,
      id: eventInfo.id,
    };

    try {
      const response = await dragEvent(
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
      } else {
        toast.error("No permission to update event.");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error dragging event:", error);
    }
  };

  return handleEventDrop;
};
