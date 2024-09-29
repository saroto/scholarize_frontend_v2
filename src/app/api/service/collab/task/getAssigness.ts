"use server";
import { redirect } from "next/navigation";
export async function getAssigness(
  token: string,
  collab_id: number,
  task_id: number
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/getassignee?task_id=${task_id}`,
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
      }
      return { error: data };
    }

    // console.log("data", data);
    return data;
  } catch (error) {
    // console.log("Failed to get assigness", error);
    throw error;
  }
}
