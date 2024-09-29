"use server";

import { redirect } from "next/navigation";

export async function readNotification(token: string, notificationID: number) {
  const response = await fetch(
    `${process.env.API_URL}/notifications/${notificationID}`,
    {
      cache: "no-cache",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();

  if (data && data.error === "Token invalid! Please login again!") {
    redirect("/auth/sessionexpire");
  }

  if (!response.ok) {
    return { success: false, error: data };
  }

  return { success: true, data: data };
}
