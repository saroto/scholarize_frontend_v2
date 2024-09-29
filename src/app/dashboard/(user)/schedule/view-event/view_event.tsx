/** @format */

// src/app/api/service/schedule/view_event.tsx
"use client";
import { useCallback, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { fetchEvent } from "@/app/api/service/schedule/getSchedule";
import { CollabWithSchedule } from "@/types";
import { SocketContext } from "@/socketio/SocketIOProvider";

export const useFetchEvents = (selectedGroups = []) => {
  const [events, setEvents] = useState([]);
  const { data: session } = useSession();
  const socket = useContext(SocketContext);
  const [overlapEvents, setOverlapEvents] = useState([]);

  function getTextColor(collab_color = "") {
    if (typeof collab_color !== "string") {
      return "black";
    }
    const color = collab_color.startsWith("#")
      ? collab_color.substring(1, 7)
      : collab_color;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "black" : "white";
  }
  /**
   * Fetches events from the server based on selected groups and updates the events state.
   */
  const fetchEvents = useCallback(async () => {
    if (!session?.user?.token || !Array.isArray(selectedGroups)) {
      console.error("Invalid session token or selectedGroups format.");
      return;
    }

    try {
      const schedules = await fetchEvent(selectedGroups, session.user.token);
      const flattenedEvents = schedules.collab_schedules
        ? schedules.collab_schedules.flatMap((collab: CollabWithSchedule) =>
            // Map only schedule data that are not null
            collab.schedules
              ? collab.schedules.map((schedule: any) => ({
                  title: schedule.ScheduleTitle,
                  start: new Date(schedule.ScheduleTimeStart),
                  end: new Date(schedule.ScheduleTimeEnd),
                  id: schedule.ScheduleID.toString(),
                  collabName: collab.collab_name,
                  collabID: collab.collab_id.toString(),
                  userID: schedule.UserID.toString(),
                  userName: schedule.UserName,
                  repeatGroup: schedule.RepeatGroup,
                  repeatInterval: schedule.RepeatInterval,
                  backgroundColor: collab.collab_color,
                  textColor: getTextColor(collab.collab_color),
                }))
              : []
          )
        : [];

      const overlappingEvents = schedules.owner_schedules
        ? schedules.owner_schedules?.flatMap((schedule: any) => ({
            title: "Unavailable",
            start: new Date(schedule.ScheduleTimeStart),
            end: new Date(schedule.ScheduleTimeEnd),
            id: schedule.ScheduleID.toString(),
            display: "background",
            backgroundColor: "#777",
          }))
        : [];

      setEvents(flattenedEvents);
      setOverlapEvents(overlappingEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [session, selectedGroups]);

  useEffect(() => {
    if (session && selectedGroups?.length > 0) {
      fetchEvents();
    }
  }, [fetchEvents, session, selectedGroups]);

  useEffect(() => {
    const scheduleChange = async (data: any) => {
      if (selectedGroups && selectedGroups.length > 0) {
        fetchEvents();
      }
    };

    if (socket) {
      socket.on("schedulechange", scheduleChange);
    }

    return () => {
      if (socket) {
        socket.off("schedulechange", scheduleChange);
      }
    };
  }, [socket, fetchEvents, selectedGroups]);

  return { events, fetchEvents, overlapEvents };
};
