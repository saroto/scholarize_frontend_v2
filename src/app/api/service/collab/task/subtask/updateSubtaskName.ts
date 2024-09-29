/** @format */

"use server";
import { redirect } from "next/navigation";
export async function UpdateSubtaskName(
  token: string,
  collab_id: string,
  formdata: FormData
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/updatesubtaskname`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
        return;
      }
      return { data: data, success: false };
    }

    return { data: data, success: true };
  } catch (error) {
    // console.log("Failed to create task", error);
    throw error;
  }
}
