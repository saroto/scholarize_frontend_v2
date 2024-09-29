"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function renameFileByFileId(
  token: string,
  groupId: number,
  fileId: number,
  folder_id: number,
  file_name: string,
  pathname: string
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  try {
    const formData = new FormData();
    formData.append("file_id", fileId.toString());
    formData.append("folder_id", folder_id.toString());
    formData.append("file_name", file_name.toString());

    const response = await fetch(
      `${process.env.API_URL}/collab/${groupId}/file/renamefile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      // invalidate cache
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      revalidatePath(pathname);
    }

    return {
      message: data.message,
      success: response.ok,
      data: data,
    };
  } catch (error) {
    // console.log("Failed to rename file by file id", error);
    throw error;
  }
}
