// src/app/api/service/schedule/createSchedule.ts
"use server";
import { redirect } from "next/navigation";
export const fetchCollaborations = async (token: string) => {
  const response = await fetch(process.env.API_URL + "/collab/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { success: false, error: data };
  }

  return { success: true, data: data };
};

export const createEvent = async (
  eventData: any,
  token: string,
  notify: boolean,
  collabID: string
) => {
  const fetchUrl =
    collabID === ""
      ? `${process.env.API_URL}/schedule/create?notify=${notify ? "yes" : "no"}`
      : `${process.env.API_URL}/collab/${collabID}/schedule/create?notify=${
          notify ? "yes" : "no"
        }`;

  const response = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { success: false, error: data };
  }

  return { success: true, data: data, notify: notify };
};
