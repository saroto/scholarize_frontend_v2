"use server";
import { SubmissionPaper, Eachpaper, submissionsHodPaper } from "@/types";
import { redirect } from "next/navigation";
export async function getPaperByHOD(session: any): Promise<SubmissionPaper> {
  // try {
  const response = await fetch(
    `${process.env.API_URL}/repository/submissions`,
    {
      // cache: "force-cache",
      // next: { revalidate: 3600 },
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
  }
  // console.log(data);
  return data; // Assuming your API wraps the papers in a "papers" field
  // } catch (error) {
  //   // throw new Error("An error occurred while fetching the papers: " + error);
  //   throw error;
  // }
}

export async function getPaperByHODById(
  session: any,
  id: string
): Promise<submissionsHodPaper> {
  // try {
  const response = await fetch(
    `${process.env.API_URL}/repository/submissions/${id}`,
    {
      cache: "no-cache",
      // next: { revalidate: 3600 },
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    // throw new Error("Failed to fetch data" + response.statusText);
  }
  return data; // Assuming your API wraps the papers in a "papers" field
  // } catch (error) {
  //   // throw new Error("An error occurred while fetching the papers: " + error);
  //   throw error;
  // }
}
