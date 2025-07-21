"use server";

import { redirect } from "next/navigation";
export async function GetPublicPaperDetailById(id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/browse/${id}`, {
      cache: "no-cache",
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch paper: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    console.error("Error in GetPublicPaperDetailById:", error);
    return {
      data: null,
      success: false,
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Unknown error",
    };
  }
}
