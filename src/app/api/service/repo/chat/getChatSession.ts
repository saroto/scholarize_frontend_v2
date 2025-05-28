"use server";

import { redirect } from "next/navigation";
export async function GetChatSession(session: any, sessionId: string) {
  // try {
  const response = await fetch(
    `${process.env.API_URL}/chat/session/${sessionId}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );

  const data = await response.json();

  console.log("GetChatSession data", data);
  if (!response.ok) {
    if (data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { error: data, success: false };
  }
  return { data: data, success: true };
  // } catch (error) {
  //   throw error;
  // }
}
