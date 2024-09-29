"use server";

import { redirect } from "next/navigation";

export async function getResearchPapers(session: any) {
  // : Promise<ResearchPaper[]>
  // try {
  const response = await fetch(
    `${process.env.API_URL}/repository/researchlibrary`,

    {
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      return redirect("/auth/sessionexpire");
    }
    return { success: false, error: data };
  }
  return { success: true, data: data };
  // return data.papers; // Assuming your API wraps the papers in a "papers" field
  // } catch (error) {
  //   throw error;
  // }
}
