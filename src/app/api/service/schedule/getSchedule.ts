/** @format */

// Fetch schedule event from all collab user filter checked box from this api "http://localhost:8080/api/schedule/getwithfilter?${query}"
"use server";
import { redirect } from "next/navigation";
export const fetchEvent = async (selectedGroups: any, token: any) => {
  if (!Array.isArray(selectedGroups)) {
    console.error("selectedGroups is not an array");
    return [];
  }

  const query = selectedGroups.map((id) => `collab_ids=${id}`).join("&");
  try {
    const response = await fetch(
      `${process.env.API_URL}/schedule/getwithfilter?${query}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      console.error(`An error has occurred: ${response.status}`);
      return [];
    }
    if (!data?.collab_schedules) {
      console.error("'collab_schedules' is not an array in the response");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
