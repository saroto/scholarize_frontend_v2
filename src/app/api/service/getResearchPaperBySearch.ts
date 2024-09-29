"use server";
import { SearchOptions, ResearchPaper } from "@/types";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
export async function getResearchPaperBySearch(
  session: any,
  searchOptions: SearchOptions
) {
  // : Promise<ResearchPaper[]>
  const url = new URL(`${process.env.API_URL}/repository/researchlibrary`);
  if (!session) {
    throw new Error("No session");
  }
  if (searchOptions.search) {
    url.searchParams.append("search", searchOptions.search);
  }
  if (searchOptions.sort) {
    url.searchParams.append("sort", searchOptions.sort);
  }

  searchOptions.department.forEach((department) => {
    url.searchParams.append("department", department.toString());
  });
  searchOptions.research_type.forEach((type) => {
    url.searchParams.append("research_type", type.toString());
  });
  searchOptions.year.forEach((year) => {
    url.searchParams.append("published_year", year.toString());
  });

  // try {
  const response = await fetch(url, {
    // cache: "force-cache",
    cache: "no-cache",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, error: data };
  }
  return data.papers;
  // } catch (error) {
  //   // console.error("Error during getResearchPapers", error);
  //   throw error;
  // }
}
