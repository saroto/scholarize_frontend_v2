// src/app/api/service/schedule/resizeSchedule.ts
"use server";
import { redirect } from "next/navigation";
export async function resizeEvent(
  eventData: any,
  token: string,
  updateType: "current" | "all",
  notify: boolean
) {
  // endpoint
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

  // response
  const response = await fetch(endpoint, {
    method: "PUT",
    cache: "no-cache",
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

  // data
  const data = await response.json();

  // check if response is successful
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, status: response.status, error: data };
  }

  // return success response
  return {
    success: true,
    status: data,
    notify: notify,
  };
}
