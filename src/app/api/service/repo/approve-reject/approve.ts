/** @format */

"use server";
import { redirect } from "next/navigation";
export async function approveResearchPaper(
  token: any,
  paperId: string,
  status: string
) {
  const formdata = new FormData();
  formdata.append("research_paper_id", paperId);
  formdata.append("approval_status", status);
  try {
    const response = await fetch(
      `${process.env.API_URL}/repository/submissions/${paperId}`,
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
        return;
      }
      return { success: false, error: data };
    }

    return { success: true, data: data };
  } catch (error) {
    // console.error("Failed to approve paper", error);
    throw error;
  }
}
