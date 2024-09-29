"use server";
import { Session } from "next-auth"; // Import the Session type if you're using Next.js authentication
import { Department, PaperType } from "@/types";
import { redirect } from "next/navigation";
export async function uploadPaper(
  formData: FormData,

  session: Session | null
) {
  const response = await fetch(`${process.env.API_URL}/repository/uploadform`, {
    method: "POST",
    headers: {
      // Include the access token in the Authorization header

      Authorization: `Bearer ${session?.user.token}`,
    },
    body: formData, // Send the FormData object
  });

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { success: false, error: data };
  }

  return { success: true, data: data };
}
