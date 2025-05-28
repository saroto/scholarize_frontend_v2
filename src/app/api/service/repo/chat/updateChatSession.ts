"use server";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
export async function saveChatHistory(
  formData: FormData,
  session: Session | null,
  sessionId: string
) {
  console.log("saveChatHistory called with FormData:", FormData);
  const response = await fetch(
    `${process.env.API_URL}/chat/update-session/${sessionId}`,
    {
      method: "POST",
      headers: {
        // Include the access token in the Authorization header

        Authorization: `Bearer ${session?.user.token}`,
      },
      body: formData, // Send the FormData object
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { success: false, error: data };
  }

  return { success: true, data: data };
}
