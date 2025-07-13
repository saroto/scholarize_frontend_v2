/** @format */

"use server";

import { SearchOptions } from "@/types";

export async function getBrowserPaper(
  search: string,
  searchOptions: "meilisearch" | "semantic"
) {
  const url = new URL(`${process.env.API_URL}/browse?search=${search}`);
  if (searchOptions) {
    url.searchParams.append("search_engine", searchOptions);
  }

  try {
    const response = await fetch(url, {
      cache: "no-cache",
      method: "GET",
    });
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
