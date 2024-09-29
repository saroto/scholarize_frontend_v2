"use server";

import { redirect } from "next/navigation";

export async function getAllNotification(token: string) {
  const response = await fetch(`${process.env.API_URL}/notifications`, {
    cache: "no-cache",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (data && data.error === "Token invalid! Please login again!") {
    redirect("/auth/sessionexpire");
  }

  if (!response.ok) {
    return { success: false, error: data };
  }

  return { success: true, data: data.notifications, allRead: data.allRead };
}
