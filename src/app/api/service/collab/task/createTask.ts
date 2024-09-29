/** @format */

"use server";
import { redirect } from "next/navigation";
export async function createTask(
  token: string,
  collab_id: number,
  formData: FormData
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/createtask`,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
        return;
      }
      return { error: data, success: false };
    }
    return { data: data, success: true };
  } catch (error) {
    // console.log("Failed to create task", error);
    throw error;
  }
}
