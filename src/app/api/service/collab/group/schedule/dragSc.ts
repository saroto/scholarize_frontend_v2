// src/app/api/service/collab/group/schedule/dragSc.ts
"use server";
import { redirect } from "next/navigation";
export async function dragEvent(
  eventData: any,
  token: string,
  updateType: "current" | "all",
  notify: boolean
): Promise<Response> {
  const endpoint =
    updateType === "all"
      ? `${process.env.API_URL}/collab/${
          eventData.collabID
        }/schedule/update-repeat?schedule_id=${eventData.id}&repeat_group=${
          eventData.repeatGroup
        }&notify=${notify ? "yes" : "no"}`
      : `${process.env.API_URL}/collab/${
          eventData.collabID
        }/schedule/update?schedule_id=${eventData.id}&notify=${
          notify ? "yes" : "no"
        }`;

  return fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ScheduleTitle: eventData.title,
      ScheduleTimeStart: eventData.start.toISOString(),
      ScheduleTimeEnd: eventData.end.toISOString(),
      RepeatGroup: eventData.repeatGroup,
      CollabID: eventData.collabID,
      id: eventData.id,
    }),
  });
}
