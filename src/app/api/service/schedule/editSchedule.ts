// src/app/api/service/schedule/editSchedule.ts
"use server";
import { redirect } from "next/navigation";
export const editEvent = async (
  eventData: any,
  token: string,
  updateType: "current" | "all",
  notify: boolean
) => {
  const notifyQuery = notify ? "yes" : "no";
  const endpoint =
    updateType === "all"
      ? `${process.env.API_URL}/collab/${eventData.collabID}/schedule/update-repeat?schedule_id=${eventData.id}&notify=${notifyQuery}`
      : `${process.env.API_URL}/collab/${eventData.collabID}/schedule/update?schedule_id=${eventData.id}&notify=${notifyQuery}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ScheduleTitle: eventData.title,
      ScheduleTimeStart: eventData.start,
      ScheduleTimeEnd: eventData.end,
      RepeatGroup: eventData.repeatGroup,
      CollabID: eventData.collabID,
      id: eventData.id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, status: response.status, error: data };
  }

  return { success: true, status: response.status, data: data, notify: notify };
};
