// src/app/api/service/collab/group/schedule/createSc.ts
"use server";
import { redirect } from "next/navigation";
export async function fetchCollaboration(collabID: string, token: string) {
  const endpoint = `${process.env.API_URL}/collab/${collabID}/get`;

  const response = await fetch(endpoint, {
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
  }
}

export async function createEvent(
  eventData: any,
  token: string,
  notify: boolean
) {
  const endpoint = `${process.env.API_URL}/collab/${
    eventData.collab_id
  }/schedule/create?notify=${notify ? "yes" : "no"}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json(); // Assuming the server responds with JSON
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
  }
}
