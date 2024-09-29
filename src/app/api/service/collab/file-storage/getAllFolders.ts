"use server";
import { redirect } from "next/navigation";
export type Folders = {
  folders: Folder[];
};

type Folder = {
  FolderID: number;
  FolderName: string;
};

export async function getAllFolders(token: string, collabId: number) {
  try {
    const api_url = new URL(
      `${process.env.API_URL}/collab/${collabId}/file/getfolders`
    );

    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    });
    const data = await response.json();
    const folder: Folders = data;
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      if (response.status === 401) {
        redirect("/dashboard/collaboration/groups");
      }
      return data;
    }

    return folder;
  } catch (error) {
    // console.error("Failed to get file by collab id", error);
    throw error;
  }
}
