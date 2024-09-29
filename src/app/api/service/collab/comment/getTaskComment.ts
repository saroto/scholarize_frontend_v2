"use server";
import { redirect } from "next/navigation";
export async function getTaskComment(
  token: string,
  collab_id: string,
  task_id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/gettaskcomments?task_id=${task_id}`,
      {
        cache: "no-cache",
        method: "GET",
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
    // console.log("Failed to get task comments", error);
    throw error;
  }
}
