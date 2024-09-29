"use server";
import { redirect } from "next/navigation";
export async function rejectResearchPaper(
  token: any,
  formData: FormData,
  paperId: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/repository/submissions/${paperId}`,
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
      }
      return { success: false, error: data };
    }
    // console.log("response", response);
    // return response.json();
  } catch (error) {
    // console.error("Failed to approve paper", error);
    throw error;
  }
}
