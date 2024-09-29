"use server";
import { redirect } from "next/navigation";
export async function rejectPaper(token: any, id: string, formData: FormData) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/repository/mypublications/rejected/${id}`,
      {
        cache: "no-cache",
        method: "POST",
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
      }
      return { success: false, error: data };
    }
    return { success: true, data: data };
  } catch (error) {
    throw new Error("Error rejecting the paper: " + error);
  }
}
export async function getRejectPaper(token: string, id: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/repository/mypublications/rejected/${id}`,
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
    // console.log("response", response);
    return data;
  } catch (error) {
    // console.error("Failed to approve paper", error);
    throw error;
  }
}
