// src/app/api/service/schedule/deleteSchedule.ts
"use server";
import { redirect } from "next/navigation";
export async function deleteEvent(
  eventId: string,
  collabID: string,
  repeatGroup: string,
  isDeleteAll: boolean,
  token: string,
  notify: boolean
) {
  const endpoint = isDeleteAll
    ? `${
        process.env.API_URL
      }/collab/${collabID}/schedule/delete-repeat?schedule_id=${eventId}&repeat_group=${repeatGroup}&notify=${
        notify ? "yes" : "no"
      }`
    : `${
        process.env.API_URL
      }/collab/${collabID}/schedule/delete?schedule_id=${eventId}&notify=${
        notify ? "yes" : "no"
      }`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, status: response.status, error: data };
  }

  return {
    success: true,
    status: data,
    notify: notify,
    message: "Event deleted successfully",
  };
}
