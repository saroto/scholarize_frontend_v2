"use server";
import { redirect } from "next/navigation";
export async function getAllTask(token: string, collab_id: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/getalltasks`,
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
      if (response.status === 401) {
        redirect("/dashboard/collaboration/groups");
      }
      return { error: data };
    }

    return data;
  } catch (error) {
    // console.log("Failed to get all task", error);
    throw error;
  }
}
