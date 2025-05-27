"use server";
import { Session } from "next-auth";
import { Department, PaperType } from "@/types";
import { redirect } from "next/navigation";

export async function chatPDF(formData: FormData, session: Session | null) {
  console.log("formData", formData);

  // Log FormData contents for debugging
  const urlEncodedData = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
    urlEncodedData.append(key, value as string);
  }
  const response = await fetch(`${process.env.SEMANTIC_SEARCH_URL}/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      // Authorization: `Bearer ${session?.user.token}`,
    },
    body: urlEncodedData,
  });

  const data = await response.json();

  console.log("data", data);
  if (!response.ok) {
    console.error("Error during chatPDF", data);
    return { success: false, error: data };
  }

  return { success: true, data: data };
}
