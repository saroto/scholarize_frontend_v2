"use server";
import { redirect } from "next/navigation";
export async function DeleteTask(
  token: string,
  formdata: FormData,
  collab_id: string
): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/task/deletetask`,
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
      return { error: data, success: false };
    }

    return { data: data, success: true };
  } catch (error) {
    // console.log("Failed to create task", error);
    throw error;
  }
}
