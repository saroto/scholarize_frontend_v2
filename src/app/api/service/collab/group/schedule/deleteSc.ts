// src/app/api/service/collab/group/schedule/deleteSc.ts
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
  const data = await response.json(); // Assuming the server responds with JSON
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, message: data.error || "Unknown error" };
  }

  return { success: true, message: "Event deleted successfully" };
}
