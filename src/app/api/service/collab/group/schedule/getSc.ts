"use server";
import { redirect } from "next/navigation";
export async function getCollabEvents(
  collabID: string,
  token: string
): Promise<any[]> {
  if (!collabID || !token) {
    console.error("CollabID or token is missing");
    return [];
  }

  const endpoint = `${process.env.API_URL}/collab/${collabID}/schedule/get`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.schedules)) {
      console.error("'schedules' is not an array in the response");
      return [];
    }

    return data.schedules.map((schedule: any) => ({
      title: schedule.ScheduleTitle,
      start: new Date(schedule.ScheduleTimeStart),
      end: new Date(schedule.ScheduleTimeEnd),
      id: schedule.ScheduleID.toString(),
      collabName: data.collab.CollabName,
      collabID: data.collab.CollabID.toString(),
      userID: schedule.UserID.toString(),
      userName: schedule.UserName,
      repeatGroup: schedule.RepeatGroup,
      repeatInterval: schedule.RepeatInterval,
      backgroundColor: data.collab.CollabColor,
      textColor: getTextColor(data.collab.CollabColor),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

function getTextColor(collab_color = "") {
  if (typeof collab_color !== "string") {
    return "black";
  }
  const color =
    collab_color.charAt(0) === "#"
      ? collab_color.substring(1, 7)
      : collab_color;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "black" : "white";
}
