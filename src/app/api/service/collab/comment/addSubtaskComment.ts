"use server";
import { redirect } from "next/navigation";
export async function addSubtaskComment(
  token: string,
  collab_id: string,
  formdata: FormData
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/addsubtaskcomment`,
      {
        method: "POST",
        cache: "no-cache",
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
      }
    }
    // return data;
  } catch (error) {
    // console.log("Failed to add subtask comment", error);
    throw error;
  }
}
