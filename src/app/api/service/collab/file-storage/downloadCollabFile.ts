"use server";
import { redirect } from "next/navigation";
export const downloadCollabFile = async (
  file_path: string,
  filename: string
) => {
  const response = await fetch(
    `${process.env.CDN_URL}/api/download-collab-file/${file_path}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  if (response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      // return;
    }
    return { success: true, response: response.blob() };
  } else {
    const error = await response.text();
    return { success: false, error: error };
  }
};
