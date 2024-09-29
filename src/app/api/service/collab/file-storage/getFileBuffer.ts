"use server";
import { redirect } from "next/navigation";
export async function getFileBuffer(
  token: string,
  groupId: number,
  filePath: string
): Promise<Uint8Array | null> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${groupId}/file/downloadfile?file_path=${filePath}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();
    if (!response.ok) {
      const data = await response.json();
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      return null;
    }

    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    // console.log("Failed to get file download buffer", error);
    throw error;
  }
}
