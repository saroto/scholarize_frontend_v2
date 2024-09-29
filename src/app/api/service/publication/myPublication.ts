"use server";
import { redirect } from "next/navigation";
export async function MyPublication(session: any) {
  // : Promise<publicResearchPaper>
  try {
    const response = await fetch(
      `${process.env.API_URL}/repository/mypublications`,
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
      // throw new Error("Failed to fetch data" + data.message);
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
        return;
      }
      return { success: false, error: data };
    }
    return { success: true, data: data };
    // return data;
  } catch (error) {
    throw error;
  }
}
