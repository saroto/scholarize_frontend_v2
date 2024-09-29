/** @format */

"use server";

export async function getBrowserPaper(search: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/browse?search=${search}`,
      {
        cache: "no-cache",
        method: "GET",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data };
    }
    return data;
  } catch (error) {
    console.error("Error during getResearchPapers", error);
    throw error;
  }
}
