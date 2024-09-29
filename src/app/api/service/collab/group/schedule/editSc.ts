// src/app/api/service/collab/group/schedule/editSc.ts
"use server";
import { redirect } from "next/navigation";
export async function editEvent(
  eventData: any,
  token: string,
  updateType: "current" | "all",
  notify: boolean
): Promise<Response> {
  const endpoint =
    updateType === "all"
      ? `${process.env.API_URL}/collab/${
          eventData.collabID
        }/schedule/update-repeat?schedule_id=${eventData.id}&notify=${
          notify ? "yes" : "no"
        }`
      : `${process.env.API_URL}/collab/${
          eventData.collabID
        }/schedule/update?schedule_id=${eventData.id}&notify=${
          notify ? "yes" : "no"
        }`;

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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to update event: ${errorData.error || "Unknown error"}`
    );
  }

  return response.json(); // Assuming the server responds with JSON
}
