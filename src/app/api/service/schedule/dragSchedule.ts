"use server";
import { redirect } from "next/navigation";
export async function dragEvent(
  eventData: any,
  token: string,
  updateType: "current" | "all",
  notify: boolean
) {
  // Declare endpoints
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

  // declare fetch
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

  // Parse response
  const data = await response.json();

  // Check if response is successful
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, status: response.status, error: data };
  }

  // Return success response
  return {
    success: true,
    status: data,
    notify: notify,
  };
}
