"use server";
import { redirect } from "next/navigation";
export async function getSubtaskComment(
  token: string,
  collab_id: string,
  subtask_id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/getsubtaskcomments?subtask_id=${subtask_id}`,
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
      }
      return { success: false, error: data };
    }
    return data;
  } catch (error) {
    // console.log("Failed to get subtask comment", error);
    throw error;
  }
}
