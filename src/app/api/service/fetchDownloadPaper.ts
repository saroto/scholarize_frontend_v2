"use server";
import { redirect } from "next/navigation";
export async function downloadPaper(session: any, path: string) {
  const url = new URL(`${process.env.API_URL}/repository/downloadpaper`);
  if (!session) {
    throw new Error("No session");
  }
  if (path) {
    url.searchParams.append("paper_path", path);
  }
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
    }

    const data = await response.blob();
    const buffer = await data.arrayBuffer();
    return Buffer.from(buffer); // Return the buffer directly
  } catch (error) {
    console.error("Error during getResearchPapers", error);
    throw error;
  }
}
