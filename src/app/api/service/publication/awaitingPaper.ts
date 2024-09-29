"use server";

import { redirect } from "next/navigation";
export async function awaitPaper(token: any, id: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/repository/mypublications/awaiting/${id}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
        return;
      }
      return { success: false, error: data };
    }

    return data;
  } catch (error) {
    // console.error("Failed to fetch papers", error);
    throw error;
  }
}
