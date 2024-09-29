"use server";
import { redirect } from "next/navigation";
export async function getCollabDetail(token: string, collab_id: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${collab_id}/get`,
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
      return { error: data };
    }

    return data;
  } catch (error) {
    throw error;
  }
}
