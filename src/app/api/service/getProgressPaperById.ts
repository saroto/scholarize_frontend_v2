"use server";

import { redirect } from "next/navigation";
export async function GetProgresPaperById(session: any, id: string) {
  // try {
  const response = await fetch(
    `${process.env.API_URL}/repository/researchlibrary/inprogress/${id}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );

  const data = await response.json();

  console.log("progress paper data", data);
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
