"use server";
import { redirect } from "next/navigation";
export async function DeleteSubtask(
  token: string,
  collab: string,
  formdata: FormData
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab}/task/deletesubtask`,
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
      return { error: data, success: false };
    }

    return { data: data, success: true };
  } catch (error) {
    // console.log("Failed to create task", error);
    throw error;
  }
}
